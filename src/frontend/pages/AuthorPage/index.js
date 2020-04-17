import React from 'react';
import {Layout, Card, Avatar, Row, Col, PageHeader} from 'antd';

import stylesItem from './Item.module.css';
import {useSelector} from "react-redux";
import SubscribeButton from "../../components/SubscribeButton";

import styles from './Author.module.css';

const {Meta} = Card;
const {Content} = Layout;

const urlImage = '/static/page_header.jpg';

const getLessons = (authorId) => (state) => state.authors[authorId].lessons;
const getAuthorInfo = (authorId) => (state) => state.authors[authorId];

const CardItem = ({id, title, subtitle, cover, avatar, semanticUrl}) => (
    <a href={`/lesson/${id}-${semanticUrl}`}>
        <Card
            hoverable
            cover={
                <div className={stylesItem.coverWrapper} style={{
                    background: `url(${cover}) center center no-repeat`,
                    backgroundSize: 'cover'
                }}>
                </div>
            }
        >
            <Meta
                avatar={<Avatar src={avatar}/>}
                title={title}
                description={subtitle}
            />
        </Card>
    </a>
);

const AuthorPage = () => {
    const authorId = 11;

    const items = useSelector(getLessons(authorId));
    const authorInfo = useSelector(getAuthorInfo(authorId));

    return (
        <Layout className="layout">
            <Content className='content'>
                <Row>
                    <Col span={24}>
                        <div
                            className={styles.headerCover}
                            style={{
                                background: `url(${urlImage}) center 0 no-repeat`,
                                backgroundSize: 'cover'
                            }}
                        >
                            <div style={{
                                zIndex: 100
                            }}>
                                <PageHeader
                                    title={authorInfo.title}
                                    subTitle={authorInfo.subtitle}
                                    extra={[
                                        <SubscribeButton key="subscribe" authorId={authorId}/>
                                    ]}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className={'site-page-header author-page-header'}>
                    <PageHeader
                        subTitle={authorInfo.subtitle}
                        extra={[
                            <SubscribeButton key="subscribe" authorId={authorId}/>
                        ]}
                    />
                </div>
                <Row gutter={{xs: 0, sm: 16, md: 16, lg: 16}}>
                    {items.map((item) => (
                        <Col md={8} sm={12} xs={24} key={item.id} className='item-block'>
                            <CardItem id={item.id} title={item.title} semanticUrl={item.semanticUrl}
                                      subtitle={item.subtitle} cover={item.cover}
                                      avatar={authorInfo.photo}/>
                        </Col>
                    ))}
                </Row>
            </Content>
        </Layout>
    )
}

export default AuthorPage;