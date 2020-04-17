import React, {useState} from 'react';
import {Col, Layout, Row, Result, PageHeader} from 'antd';
import {
    Form,
    Input,
    Button,
    message
} from 'antd';
import axios from 'axios';

import 'react-image-crop/dist/ReactCrop.css';
import styles from './Lesson.module.css';
import Page from "../../components/Page";
import UploadImageFormItem from "../../components/Form/UploadImageFormItem";

const {Content} = Layout;
const {TextArea} = Input;


export default () => {
    const [successView, setSuccessView] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const form = Form.useForm();
    const onSubmit = async (values) => {
        setIsFetching(true);
        try {
            const result = await axios({
                method: 'post',
                url: '/lesson',
                data: values
            });

            if (result.data.id) {
                setSuccessView(result.data);
                form[0].resetFields();
            }
        } catch (e) {
            message.error(`Ошибка добавления урока`);
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
                            title="Добавление урока"
                        />
                        <div className={styles.contentWrapper}>
                            {successView ? (
                                <Result
                                    status="success"
                                    title={'Урок успешно добавлен'}
                                    subTitle={successView.name}
                                    extra={[
                                        <Button onClick={() => setSuccessView(null)} type="primary" key="create">
                                            Добавить еще один урок
                                        </Button>,
                                        <Button href={`/lesson/${successView.id}`} key="go">Перейти к уроку</Button>,
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
                                        name={'name'}
                                        label="Название урока"
                                    >
                                        <Input maxLength={128}/>
                                    </Form.Item>
                                    <Form.Item rules={[
                                        {
                                            required: true,
                                            message: 'Поле обязательно для заполнения',
                                        },
                                    ]} name={'short_des'} label="Краткое описание">
                                        <TextArea maxLength={128}/>
                                    </Form.Item>
                                    <Form.Item rules={[
                                        {
                                            required: true,
                                            message: 'Загрузите обложку для отображения урока в ленте',
                                        },
                                    ]} name={'cover'} label="Обложка для отображения в ленте">
                                        <UploadImageFormItem
                                            aspect={390 / 130}
                                            minSelectedWidth={390}
                                            minSelectedHeight={130}
                                            accept={[
                                                'image/jpeg',
                                                'image/png'
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item rules={[
                                        {
                                            required: true,
                                            message: 'Поле обязательно для заполнения',
                                        }, {
                                            type: 'url',
                                            pattern: /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&"'>]+)/,
                                            message: 'Поле должно содержать ссылку на youtube видео',
                                        },
                                    ]} name={'youtube_link'} label="Ссылка на видео youtube">
                                        <Input placeholder={'https://www.youtube.com/watch?v='}/>
                                    </Form.Item>
                                    <Form.Item rules={[
                                        {
                                            required: true,
                                            message: 'Поле обязательно для заполнения',
                                        },
                                    ]} name={'description'} label="Описание урока">
                                        <TextArea rows={5}/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button loading={isFetching} type="primary" htmlType="submit">
                                            Сохранить
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