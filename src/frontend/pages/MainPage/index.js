import React from 'react';
import {Layout, PageHeader, Typography, Row, Col} from 'antd';
import classNames from 'classnames';

import styles from './Main.module.css';

const {Content} = Layout;

const LessonsPage = () => {
    return (
        <>
            <div className={styles.dashboard}>
                <Layout className={classNames('layout', styles.layout)}>
                    <div className={styles.mainContent}>
                        Кондитерские курсы для каждого
                    </div>
                    <div style={{
                        padding: '12px 12px'
                    }}>
                        <Row gutter={16}>
                            <Col xs={24} md={10}>
                                <Row gutter={0}>
                                    <Col span={8}>
                                        <div className={styles.cardNote}>
                                            <div className={styles.cardNote__count}>
                                                3
                                            </div>
                                            <div className={styles.cardNote__name}>
                                                автора
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className={styles.cardNote}>
                                            <div className={styles.cardNote__count}>
                                                3
                                            </div>
                                            <div className={styles.cardNote__name}>
                                                публичные страницы
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className={styles.cardNote}>
                                            <div className={styles.cardNote__count}>
                                                3
                                            </div>
                                            <div className={styles.cardNote__name}>
                                                опубликованных урока
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Layout>
            </div>
            <Layout className="layout">
                <Content className='content'>
                    <Row gutter={{xs: 0, sm: 16, md: 16, lg: 16}}>
                        <Col md={8} sm={12} xs={24}>
                            Привте друг
                        </Col>
                        <Col span={8}>
                            dsa
                        </Col>
                        <Col span={8}>
                            dsa
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </>
    )
}

export default LessonsPage;