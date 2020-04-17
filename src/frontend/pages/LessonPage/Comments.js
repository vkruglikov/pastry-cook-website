import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {SendOutlined} from '@ant-design/icons';
import {Input, Form, Button, Typography} from 'antd';

import CommentComponent from "../../components/Comment";
import SocialLoginButton from "../../components/SocialLoginButton";
import {addLessonComment} from "../../redux/lessonsReducer";
import {getLessonById} from "../../redux/selectors";

import styles from './Comments.module.css';

const getUserInfo = (state) => state.user;


const {Title} = Typography;

const CommentEditor = ({onChange, onSubmit, submitting, value}) => (
    <Form layout='inline'>
        <div style={{
            flex: 1
        }}>
            <Input placeholder='Оставьте комментарий' allowClear onChange={(e) => onChange(e.target.value)}
                   value={value}/>
        </div>
        <div>
            <Button style={{
                color: '#929292'
            }} type="link" icon={<SendOutlined/>} htmlType="submit" loading={submitting}
                    onClick={onSubmit}/>
        </div>
    </Form>
);

const CommentContainer = ({text, canReplay, addComment, id, photo, author, children, isNew}) => {
    const [showTextArea, setShowTextArea] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState();
    const [replayText, setReplayText] = useState(null);

    return (
        <div className={isNew && styles.newComment}>
            <CommentComponent
                text={text}
                photo={photo}
                author={author}
                canReplay={canReplay && !showTextArea}
                onReplay={() => setShowTextArea(true)}
            >
                {canReplay && showTextArea && (
                    <CommentEditor
                        onChange={setReplayText}
                        onSubmit={async () => {
                            setIsSubmitting(true);
                            try {
                                await addComment(replayText, id);
                                setReplayText(null);
                                setShowTextArea(false);
                            } catch (e) {
                                console.error(e);
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        submitting={isSubmitting}
                        value={replayText}
                    />
                )}
                {children}
            </CommentComponent>
        </div>
    )
}

const Comments = ({lessonId}) => {
    const {
        login,
    } = useSelector(getUserInfo);
    const comments = useSelector((state) => getLessonById(lessonId)(state).comments);

    const dispatch = useDispatch();

    const [newComment, setNewComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState();


    const addComment = useCallback(async (comment, parentId) => dispatch(addLessonComment({
        lessonId, comment, parentId
    })), [lessonId, dispatch]);


    return (
        <div>
            <Title level={4}>
                Обсуждение
            </Title>
            {!login && (
                <div>
                    <div style={{
                        marginBottom: '0.5em',
                    }}>
                        Авторизуйтесь чтобы участвовать в обсуждении
                    </div>
                    <SocialLoginButton block>Авторизоваться через Вконтакте</SocialLoginButton>
                </div>
            )}
            {login && (
                <CommentEditor
                    onChange={setNewComment}
                    onSubmit={async () => {
                        setIsSubmitting(true);
                        try {
                            await addComment(newComment, null);
                            setNewComment(null);
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}
                    submitting={isSubmitting}
                    value={newComment}
                />
            )}
            {comments.length ? (
                <div className={styles.commentsList}>
                    {comments.filter(item => !item.parentId).sort((itemA, itemB) => itemB.date - itemA.date).map((item) => (
                        <CommentContainer
                            key={item.id}
                            id={item.id}
                            text={item.text}
                            photo={item.photo}
                            isNew={item.isNew}
                            author={item.author}
                            canReplay={login}
                            addComment={addComment}
                        >
                            {comments.filter(subItem => subItem.parentId === item.id).sort((itemA, itemB) => itemA.date - itemB.date).map((subItem) => (
                                <CommentContainer
                                    key={subItem.id}
                                    id={subItem.id}
                                    text={subItem.text}
                                    photo={subItem.photo}
                                    isNew={subItem.isNew}
                                    author={subItem.author}
                                    canReplay={false}
                                    addComment={addComment}
                                />
                            ))}
                        </CommentContainer>
                    ))}
                </div>
            ) : (
                <div style={{
                    fontSize: '14px',
                    marginTop: '12px'
                }}>
                    0 комментариев
                </div>
            )}
        </div>
    );
}

export default Comments;