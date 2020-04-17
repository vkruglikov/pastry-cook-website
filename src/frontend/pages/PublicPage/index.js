import React from 'react';
import {Layout, Card, Avatar, Row, Col, PageHeader} from 'antd';
import {useParams} from 'react-router-dom';

import stylesItem from './Item.module.css';
import {useSelector} from "react-redux";

import styles from './Public.module.css';

const {Meta} = Card;
const {Content} = Layout;

const getAuthorInfo = (id) => (state) => state.public[id];

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
    const params = useParams();
    const publicId = parseInt(params.publicId);

    const {
        posts: items,
        ...authorInfo
    } = useSelector(getAuthorInfo(publicId));

    return (
        <Layout className="layout">
        <Content className='content'>
            <Row>
                <Col span={24}>
                    <div
                        className={styles.headerCover}
                        style={{
                            background: `url(${authorInfo.cover_image_url}) center 0 no-repeat`,
                            backgroundSize: 'cover'
                        }}
                    >
                        <div style={{
                            zIndex: 100
                        }}>
                            <PageHeader
                                title={authorInfo.title}
                                subTitle={authorInfo.subtitle}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <div className={'site-page-header author-page-header'}>
                <PageHeader
                    subTitle={authorInfo.subtitle}
                />
            </div>
            <Row gutter={{xs: 0, sm: 16, md: 16, lg: 16}}>
                {items.map((item) => (
                    <Col md={8} sm={12} xs={24} key={item.id} className='item-block'>
                        <CardItem id={item.id} title={item.title} semanticUrl={item.semanticUrl}
                                  subtitle={item.subtitle} cover={item.cover}
                                  avatar={item.authorPhoto}/>
                    </Col>
                ))}
            </Row>
        </Content>
        </Layout>
    )
}

export default AuthorPage;