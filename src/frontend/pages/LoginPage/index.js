import React from 'react';
import {Layout, Breadcrumb, Row, Col, Button} from 'antd';

import styles from './Login.module.css';
import SocialLoginButton from "../../components/SocialLoginButton";

const {Content} = Layout;

const LessonsPage = () => {
    return (
        <Layout className="layout">
        <Content className={'content'}>
            <Breadcrumb style={{margin: '16px 10px'}}>
                <Breadcrumb.Item>Главная</Breadcrumb.Item>
                <Breadcrumb.Item>Видеокурсы</Breadcrumb.Item>
                <Breadcrumb.Item>Как готовить карамель</Breadcrumb.Item>
            </Breadcrumb>
            <div className={styles.contentWrapper}>
                <Row gutter={[15, 0]}>
                    <Col span={24}>
                        <SocialLoginButton>Войти</SocialLoginButton>
                    </Col>
                </Row>
            </div>
        </Content>
        </Layout>
    )
}

export default LessonsPage;