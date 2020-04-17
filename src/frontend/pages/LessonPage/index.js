import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {useParams} from 'react-router-dom';
import {Col, Layout, PageHeader, Row, Typography, Rate} from 'antd';

import Comments from './Comments';
import styles from './Lesson.module.css';
import {getLessonById} from "../../redux/selectors";
import SubscribeButton from "../../components/SubscribeButton";
import Page from "../../components/Page";
import axios from "axios";

const {Content} = Layout;
const {Title} = Typography;

const itemRender = (route, params, routes) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
        <span>{route.breadcrumbName}</span>
    ) : (
        <a href={route.path}>{route.breadcrumbName}</a>
    );
}

const breadcrumb = {
    itemRender,
    routes: [
        {
            path: '/author/noisy_breeze',
            breadcrumbName: 'Кондитерские уроки Федоровой Оксаны',
        },
        {
            breadcrumbName: 'Как готовить карамель',
        },
    ]
};

const LessonsPage = () => {
    const {lessonId} = useParams();
    const authorId = useSelector((state) => getLessonById(lessonId)(state).author_id);
    const name = useSelector((state) => getLessonById(lessonId)(state).name);
    const description = useSelector((state) => getLessonById(lessonId)(state).description);
    const video = useSelector((state) => getLessonById(lessonId)(state).video);

    const [rate, setRate] = useState(0);

    const setRateAndSend = (rateValue) => {
        setRate(rateValue);
        axios({
            url: `/rate`,
            method: "POST",
            data: {
                rateValue,
                authorId,
                lessonId
            }
        });
    };

    return (
        <Content className='content'>
            <div className={styles.contentWrapper}>
                <Row gutter={[15, 0]}>
                    <Col md={16} xs={24}>
                        <Row>
                            <Col span={24}>
                                <div className={styles.youtubeContainer}>
                                    <iframe className={styles.youtubeContainer__frame} width="854" height="480"
                                            src={`https://www.youtube-nocookie.com/embed/${video.id}?modestbranding=1&showinfo=0&rel=0&enablejsapi=1`}
                                            frameBorder="0"
                                            allowFullScreen></iframe>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <div className={'site-page-header'}>
                                    <PageHeader
                                        breadcrumb={breadcrumb}
                                        title={name}
                                        extra={[
                                            <SubscribeButton key="subscribe" lessonId={lessonId}
                                                             authorId={authorId}/>
                                        ]}
                                    />
                                </div>
                                <div className={styles.commentWrapper}
                                     dangerouslySetInnerHTML={{__html: description}}>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={8} xs={24}>
                        <div className='lesson-right-content'>
                            <Row gutter={[15, 15]}>
                                <Col span={24}>
                                    <Title level={4}>
                                        Оцените урок
                                    </Title>
                                    <div>
                                        <Rate
                                            tooltips={['Отвратительно', 'Не оправдал ожидания', 'Могло быть и лучше', 'Хорошо', 'Восхитительно']}
                                            onChange={setRateAndSend} value={rate}/>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={[15, 15]}>
                                <Col span={24}>
                                    <Comments lessonId={lessonId}/>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        </Content>
    )
}

export default () => (
    <Layout className="layout">
    <Page>
        <LessonsPage/>
    </Page>
    </Layout>
);