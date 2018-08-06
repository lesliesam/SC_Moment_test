package com.sc.entity;

import io.swagger.annotations.ApiModel;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
@Entity
@Table(name = "moment", schema = "", catalog = "moment")
@ApiModel(value="Moment entity", description="Moment information.")
public class MomentEntity {
    private int id;
    private UserEntity poster;
    private Timestamp createTime;
    private String text;
    private String images;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false, insertable = true, updatable = true)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    public UserEntity getPoster() {
        return poster;
    }

    public void setPoster(UserEntity poster) {
        this.poster = poster;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MomentEntity that = (MomentEntity) o;

        if (id != that.id) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result;
        return result;
    }

    @Basic
    @Column(name = "create_time", nullable = true, insertable = true, updatable = true)
    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }


    @Basic
    @Column(name = "text", nullable = true, insertable = true, updatable = true, length = 1000)
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Basic
    @Column(name = "images", nullable = true, insertable = true, updatable = true, length = 2000)
    public String getImages() {
        return images;
    }

    public void setImages(String images) {
        this.images = images;
    }
}
