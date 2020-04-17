import React from 'react';
import {Layout, Breadcrumb, Card, Grid, Avatar, Row, Col, PageHeader} from 'antd';
import {
    Link
} from "react-router-dom";
import { Skeleton, Switch } from 'antd';

import stylesItem from './Item.module.css';

const { Meta } = Card;
const { Content } = Layout;

const urlImage = 'https://scontent-cph2-1.cdninstagram.com/v/t51.2885-15/e35/19436937_322607174836123_1067122171295301632_n.jpg?_nc_ht=scontent-cph2-1.cdninstagram.com&_nc_cat=107&_nc_ohc=S-52elo39BMAX8C8MbC&oh=c9959ab6c4f3215e6643edda0e8c0d6d&oe=5EBB2C50';
const avatar = 'https://sun9-22.userapi.com/impf/c853524/v853524227/da3a7/WSIX8gHYkbE.jpg?size=400x0&quality=90&sign=1c3080ff97b47a3c38a0d6c77193e8da';

const LessonsPage = () => {
    const items = [1,2,3,4,5];

    const cardItem = (
        <Link to={'/lesson/test'}>
            <Card
                hoverable
                cover={
                    <div className={stylesItem.coverWrapper}>
                        <img
                            src={urlImage}
                        />
                    </div>
                }
            >
                <Meta
                    avatar={<Avatar src={avatar} />}
                    title="Card title"
                    description="This is the description"
                />
            </Card>
        </Link>
    );

    return (
        <Content className='content'>
            <Row>
                <Col span={24}>
                    <div
                        style={{
                            height: '200px',
                            overflow: 'hidden'
                        }}
                    >
                        <img
                            style={{
                                width: '100%'
                            }}
                            src={'https://scontent-cph2-1.cdninstagram.com/v/t51.2885-15/e35/19436937_322607174836123_1067122171295301632_n.jpg?_nc_ht=scontent-cph2-1.cdninstagram.com&_nc_cat=107&_nc_ohc=S-52elo39BMAX8C8MbC&oh=c9959ab6c4f3215e6643edda0e8c0d6d&oe=5EBB2C50'}
                        />
                    </div>
                </Col>
            </Row>
            <div className={'site-page-header'}>
                <PageHeader
                    title="Как готовить карамель"
                    subTitle="Видеоурок для начинающих"
                />
            </div>
            <Breadcrumb style={{ margin: '16px 10px' }}>
                <Breadcrumb.Item>Главная</Breadcrumb.Item>
                <Breadcrumb.Item>Видеоуроки</Breadcrumb.Item>
            </Breadcrumb>
            <Row gutter={{ xs: 0, sm: 16, md: 16, lg: 16 }}>
                {items.map((itemId) => (
                    <Col md={8} sm={12} xs={26} key={itemId} className='item-block'>
                        {cardItem}
                    </Col>
                ))}
            </Row>
        </Content>
    )
}

export default LessonsPage;