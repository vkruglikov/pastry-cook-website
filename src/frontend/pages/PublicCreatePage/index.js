import React, {useState} from 'react';
import {Col, Layout, Result, Row} from 'antd';
import {
    Form,
    Input,
    Button,
    message,
    PageHeader
} from 'antd';
import axios from 'axios';

import 'react-image-crop/dist/ReactCrop.css';
import styles from './Lesson.module.css';
import Page from "../../components/Page";
import UploadImageFormItem from "../../components/Form/UploadImageFormItem";

const {Content} = Layout;


export default () => {
    const [successView, setSuccessView] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const form = Form.useForm();
    const onSubmit = async (values) => {
        try {
            setIsFetching(true);
            const result = await axios({
                method: 'post',
                url: '/public',
                data: values
            });

            if (result.data.id) {
                setSuccessView(result.data);
                form[0].resetFields();
            }
        } catch (e) {
            message.error(`Ошибка создания`);
            console.error(e);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <Layout className="layout">
            <Page>
                <Content className='content'>
                    <Row>
                        <Col md={16} xs={24}>
                            <PageHeader
                                className="site-page-header"
                                title="Создание публичной страницы"
                            />
                            <div className={styles.contentWrapper}>
                                {successView ? (
                                    <Result
                                        status="success"
                                        title={'Публичная страница создана'}
                                        subTitle={successView.title}
                                        extra={[
                                            <Button onClick={() => setSuccessView(null)} type="primary" key="create">
                                                Создать еще одну страницу
                                            </Button>,
                                            <Button href={`/public${successView.id}`} key="go">Перейти на
                                                страницу</Button>,
                                        ]}
                                    />
                                ) : (
                                    <Form
                                        onFinish={onSubmit}
                                        layout="vertical"
                                        form={form[0]}
                                    >
                                        <Form.Item
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Поле обязательно для заполнения',
                                                },
                                            ]}
                                            name={'title'}
                                            label="Заголовок"
                                        >
                                            <Input maxLength={128}/>
                                        </Form.Item>
                                        <Form.Item
                                            name={'subtitle'}
                                            label="Подзаголовок"
                                        >
                                            <Input maxLength={256}/>
                                        </Form.Item>
                                        <Form.Item
                                            name={'cover'}
                                            label="Обложка страницы"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Загрузите обложку для отображения в шапке страницы',
                                                },
                                            ]}
                                        >
                                            <UploadImageFormItem
                                                aspect={1200 / 200}
                                                minSelectedWidth={1200}
                                                minSelectedHeight={200}
                                                accept={[
                                                    'image/jpeg',
                                                    'image/png'
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button loading={isFetching} type="primary" htmlType="submit">
                                                Создать страницу
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Page>
        </Layout>
    );
}