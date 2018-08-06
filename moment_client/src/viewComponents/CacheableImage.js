import React from 'react';
import { Image, ActivityIndicator, NetInfo ,ImageBackground} from 'react-native';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';
import ResponsiveImage from 'react-native-responsive-image';
import PropTypes from 'prop-types';

const SHA1 = require("crypto-js/sha1");
const URL = require('url-parse');

export default
class CacheableImage extends React.Component {

    constructor(props) {
        super(props)
        this.imageDownloadBegin = this.imageDownloadBegin.bind(this);
        this.imageDownloadProgress = this.imageDownloadProgress.bind(this);
        this._handleConnectivityChange = this._handleConnectivityChange.bind(this);

        this.state = {
            isRemote: false,
            cachedImagePath: null,
            downloading: false,
            cacheable: true,
            jobId: null,
            networkAvailable: false
        };
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.source != this.props.source) {
            this._processSource(nextProps.source);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state && nextProps === this.props) {
            return false;
        }
        return true;
    }

    async imageDownloadBegin(info) {
        this.setState({downloading: true, jobId: info.jobId});
    }

    async imageDownloadProgress(info) {
        if ((info.contentLength / info.bytesWritten) == 1) {
            this.setState({downloading: false, jobId: null});
        }
    }

    async checkImageCache(imageUri, cachePath, cacheKey) {
        const dirPath = DocumentDirectoryPath+'/'+cachePath;
        const filePath = dirPath+'/'+cacheKey;

        RNFS
        .stat(filePath)
        .then((res) => {

            if (res.isFile()) {
                // means file exists, ie, cache-hit
								console.log('cacth exist');
                this.setState({cacheable: true, cachedImagePath: filePath , isRemote : true});
            }
        })
        .catch((err) => {
            // means file does not exist
            // first make sure network is available..
            if (! this.state.networkAvailable) {
                this.setState({cacheable: false, cachedImagePath: null , isRemote : true});
                return;
            }

            // then make sure directory exists.. then begin download
            // The NSURLIsExcludedFromBackupKey property can be provided to set this attribute on iOS platforms.
            // Apple will reject apps for storing offline cache data that does not have this attribute.
            // https://github.com/johanneslumpe/react-native-fs#mkdirfilepath-string-options-mkdiroptions-promisevoid
            RNFS
            .mkdir(dirPath, {NSURLIsExcludedFromBackupKey: true})
            .then(() => {
                // before we change the cachedImagePath.. if the previous cachedImagePath was set.. remove it
                if (this.state.cacheable && this.state.cachedImagePath) {
                    let delImagePath = this.state.cachedImagePath;
                    this.deleteFilePath(delImagePath);
                }

                let downloadOptions = {
                    fromUrl: imageUri,
                    toFile: filePath,
                    background: true,
                    begin: this.imageDownloadBegin,
                    progress: this.imageDownloadProgress
                };

                // directory exists.. begin download
                RNFS
                .downloadFile(downloadOptions)
                .promise
                .then((result) => {
									if(result.statusCode == 200){
										this.setState({cacheable: true, cachedImagePath: filePath , isRemote : true});
									}else{
										this.setState({cacheable: false, cachedImagePath: null , isRemote : true});
									}

                })
                .catch((err) => {
                    // error occurred while downloading or download stopped.. remove file if created
                    this._deleteFilePath(filePath);
                    this.setState({cacheable: false, cachedImagePath: null , isRemote : true});
                });
            })
            .catch((err) => {
                this._deleteFilePath(filePath);
                this.setState({cacheable: false, cachedImagePath: null , isRemote : true});
            })
        });
    }

    _deleteFilePath(filePath) {
        RNFS
        .exists(filePath)
        .then((res) => {
            if (res) {
                RNFS
                .unlink(filePath)
                .catch((err) => {});
            }
        });
    }

    _processSource(source) {
        if (source !== null
		    && source != ''
            && typeof source === "object"
            && source.hasOwnProperty('uri'))
        { // remote
            const url = new URL(source.uri, null, true);

            // handle query params for cache key
            let cacheable = url.pathname;
            if (Array.isArray(this.props.useQueryParamsInCacheKey)) {
                this.props.useQueryParamsInCacheKey.forEach(function(k) {
                    if (url.query.hasOwnProperty(k)) {
                        cacheable = cacheable.concat(url.query[k]);
                    }
                });
            }
            else if (this.props.useQueryParamsInCacheKey) {
                cacheable = cacheable.concat(url.query);
            }

            // ignore extension
            const type = url.pathname.replace(/.*\.(.*)/, '$1');
            const cacheKey = SHA1(cacheable) + '.' + (type.length < url.pathname.length ? type : '');

            this.checkImageCache(source.uri, url.host, cacheKey);
            this.setState({isRemote: true});
        }
        else {
            this.setState({isRemote: false});
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this._handleConnectivityChange);
        // initial
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({networkAvailable: isConnected});
		});

        this._processSource(this.props.source);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('change', this._handleConnectivityChange);

        if (this.state.downloading && this.state.jobId) {
            RNFS.stopDownload(this.state.jobId);
        }
    }

    async _handleConnectivityChange(isConnected) {
	    this.setState({
            networkAvailable: isConnected,
	    });
    };

    render() {
        // if (!this.state.isRemote) {
        //     return this.renderLocal();
        // }

        if (this.state.cacheable && this.state.cachedImagePath) {
            return this.renderCache();
        }

        if (this.props.defaultSource) {
            return this.renderDefaultSource();
        }

        return (
            <ActivityIndicator {...this.props.activityIndicatorProps} />
        );
    }

    renderCache() {
        const { children, defaultSource, activityIndicatorProps, ...props } = this.props;
        return (
            <ResponsiveImage {...props} source={{uri: 'file://'+this.state.cachedImagePath}}>
            {children}
            </ResponsiveImage>
        );
    }

    // renderLocal() {
    //     const { children, defaultSource, activityIndicatorProps, ...props } = this.props;
    //     return (
    //         <ResponsiveImage {...props}>
    //         {children}
    //         </ResponsiveImage>
    //     );
    // }

    renderDefaultSource() {
        const { children, defaultSource, ...props } = this.props;
        return (
            <ImageBackground {...props} source={defaultSource}>
            {children}
            </ImageBackground>
        );
    }
}

CacheableImage.propTypes = {
    activityIndicatorProps: PropTypes.object,
    defaultSource: Image.propTypes.source,
    useQueryParamsInCacheKey: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.array
    ])
};


CacheableImage.defaultProps = {
    style: { backgroundColor: 'transparent' },
    activityIndicatorProps: {
        style: { backgroundColor: 'transparent', flex: 1 }
    },
    useQueryParamsInCacheKey: false // bc
};
