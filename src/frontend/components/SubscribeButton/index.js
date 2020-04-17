import React, {useState} from 'react';
import {Modal, Input, Form, Button} from "antd";
import axios from "axios";
import {useSelector} from "react-redux";
import {getUserData} from "../../redux/selectors";

const SubscribeButton = ({authorId, lessonId}) => {
    const [buttonVisible, setButtonVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const userId = useSelector((state) => getUserData(state).user_id);

    if (!buttonVisible) return null;

    const subscribe = async () => {
        setConfirmLoading(true);
        await axios({
            url: `/subscribe`,
            method: "POST",
            data: {
                email,
                userId,
                authorId,
                lessonId
            }
        });
        setConfirmLoading(false);
        setModalVisible(false);
        setButtonVisible(false);
    };

    return (
        <>
            <Button type={'primary'} shape="round" onClick={() => setModalVisible(true)}>Подписаться</Button>
            <Modal
                visible={modalVisible}
                onOk={subscribe}
                confirmLoading={confirmLoading}
                cancelText={'Отмена'}
                okText={'Подписаться'}
                onCancel={() => setModalVisible(false)}
            >
                <h3>Хочешь всегда быть вкурсе когда выходит новый урок?</h3>
                <p>Оставь нам свой e-mail, и мы пришлем ссылку</p>
                <Form>
                    <Input onChange={(e) => setEmail(e.target.value)} placeholder={'Email'} name={'email'}
                           autoComplete={'on'} value={email}/>
                    <button onClick={subscribe} type={'submit'} style={{
                        display: 'none'
                    }}/>
                </Form>
            </Modal>
        </>
    );
}

export default SubscribeButton;