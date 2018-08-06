package com.sc.services;

import com.sc.HibernateUtil;
import com.sc.entity.MomentEntity;
import com.sc.entity.UserEntity;
import org.hibernate.Session;

import java.sql.Timestamp;
import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public class MomentServicesImpl implements MomentServices{

    @Override
    public MomentEntity postMoment(UserEntity user, String text, String images) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        MomentEntity moment = new MomentEntity();
        moment.setPoster(user);
        moment.setCreateTime(new Timestamp(System.currentTimeMillis()));
        moment.setText(text);
        moment.setImages(images);

        session.beginTransaction();
        session.save(moment);
        session.getTransaction().commit();

        session.close();
        return moment;
    }

    @Override
    public List<MomentEntity> getMoments(UserEntity user, int step, int stepLength) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        String queryStr = "from MomentEntity moment order by moment.createTime desc";
        List<MomentEntity> list = session.createQuery(queryStr).
                setFirstResult(step * stepLength).
                setMaxResults(stepLength).
                list();

        session.close();
        return list;
    }
}
