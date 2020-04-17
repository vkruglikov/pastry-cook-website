import React from 'react';
import {Layout, Breadcrumb, Row, Col} from 'antd';
import { Comment, Avatar, List, Timeline, Form, Button, PageHeader, Input } from 'antd';
import { Typography } from 'antd';


import VideoPlayer from "react-soul-player/dist/VideoPlayer";

import styles from './Lesson.module.css';

const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;

const data = [
    {
        title: 'Как готовить карамель',
    },    {
        title: 'Начинаим готовить тесто хуесто',
    },    {
        title: 'Закрепляем все полученные знания',
    }
];

const ExampleComment = ({ children }) => (
    <Comment
        actions={[<span key="comment-nested-reply-to">Reply to</span>]}
        author={<a>Han Solo</a>}
        avatar={
            <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
            />
        }
        content={
            <p>
                We supply a series of design principles, practical patterns and high quality design
                resources (Sketch and Axure).
            </p>
        }
    >
        {children}
    </Comment>
);

const LessonsPage = () => {
    return (
        <Content className={'content'}>
            <Breadcrumb style={{ margin: '16px 10px' }}>
                <Breadcrumb.Item>Главная</Breadcrumb.Item>
                <Breadcrumb.Item>Видеокурсы</Breadcrumb.Item>
                <Breadcrumb.Item>Как готовить карамель</Breadcrumb.Item>
            </Breadcrumb>
            <div className={styles.contentWrapper}>
                <Row gutter={[15, 0]}>
                    <Col span={16}>
                        <Row>
                            <Col span={24}>
                                <VideoPlayer id='lesson'/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <div className={'site-page-header'}>
                                    <PageHeader
                                        title="Как готовить карамель"
                                        subTitle="Видеоурок для начинающих"
                                    />
                                </div>
                                <div className={styles.commentWrapper}>
                                    {null && (
                                        <Comment
                                            avatar={
                                                <Avatar
                                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                                    alt="Han Solo"
                                                />
                                            }
                                            content={
                                                <div>
                                                    <Form.Item>
                                                        <TextArea rows={4} onChange={() => {}} value={''} />
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <Button htmlType="submit" loading={false} onClick={() => {}} type="primary">
                                                            Add Comment
                                                        </Button>
                                                    </Form.Item>
                                                </div>
                                            }
                                        />
                                    )}
                                    <ExampleComment>
                                        <ExampleComment />
                                        <ExampleComment />
                                    </ExampleComment>
                                    <ExampleComment />
                                    <ExampleComment />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <div className='lesson-right-content'>
                            <Title level={4}>Содержание курса</Title>
                            <List
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a href="https://ant.design">{item.title}</a>}
                                            description="Описание людей и туда сюда штуки дрюки куки дрюки мои штуки"
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </Content>
    )
}

export default LessonsPage;