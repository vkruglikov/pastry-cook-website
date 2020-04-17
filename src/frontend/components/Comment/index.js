import React from 'react';
import {Comment, Avatar} from 'antd';

const CommentComponent = ({className, children, author, text, photo, canReplay, onReplay}) => (
    <Comment
        className={className}
        actions={canReplay ? [<span onClick={onReplay} key="comment-nested-reply-to">Добавить ответ</span>] : null}
        author={author}
        avatar={
            <Avatar
                src={photo}
                alt={author}
            />
        }
        content={
            <p>{text}</p>
        }
    >
        {children}
    </Comment>
)

export default CommentComponent;