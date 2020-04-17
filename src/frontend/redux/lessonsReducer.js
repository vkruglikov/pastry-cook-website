import {getStoreStateData} from "../dataProvider";
import axios from "axios";

const initialState = getStoreStateData('lessons') || {};

export const ADD_COMMENT_TO_LESSON_ACTION = 'ADD_COMMENT_TO_LESSON';
export const MARK_NEW_COMMENT_LESSON_ACTION = 'MARK_NEW_COMMENT_LESSON';
export const UNMARK_NEW_COMMENT_LESSON_ACTION = 'UNMARK_NEW_COMMENT_LESSON';

export const addLessonComment = ({lessonId, comment, parentId}) => async (dispatch, getState) => {
    const commentData = await axios({
        url: `/comments/add/lesson/${lessonId}`,
        method: "POST",
        data: {
            text: comment,
            parent_id: parentId
        }
    });

    const commentInfo = commentData.data['comment'];
    const commentId = commentInfo.id;

    dispatch({
        type: ADD_COMMENT_TO_LESSON_ACTION,
        payload: {
            lessonId,
            comment: {
                id: commentId,
                parentId: commentInfo.parent_id,
                lessonId: commentInfo.lesson_id,
                author: commentInfo.author,
                date: commentInfo.date,
                text: commentInfo.text,
                photo: commentInfo.photo,
            }
        }
    });
    dispatch({
        type: MARK_NEW_COMMENT_LESSON_ACTION,
        payload: {
            lessonId,
            commentId
        }
    });
    setTimeout(() => {
        dispatch({
            type: UNMARK_NEW_COMMENT_LESSON_ACTION,
            payload: {
                lessonId,
                commentId
            }
        });
    }, 500);
};

const updateComment = (state, lessonId, commentId) => (updater) => ({
    ...state,
    [lessonId]: {
        ...state[lessonId],
        comments: [
            ...state[lessonId].comments,
        ].map((comment) => comment.id === commentId ? updater(comment) : comment)
    }
})

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_COMMENT_TO_LESSON_ACTION: {
            let {
                lessonId,
                comment
            } = action.payload;


            return {
                ...state,
                [lessonId]: {
                    ...state[lessonId],
                    comments: [
                        ...state[lessonId].comments,
                        {...comment}
                    ]
                }
            };
        }
        case MARK_NEW_COMMENT_LESSON_ACTION: {
            let {
                lessonId,
                commentId
            } = action.payload;

            return updateComment(state, lessonId, commentId)((comment) => ({
                ...comment,
                isNew: true
            }));
        }
        case UNMARK_NEW_COMMENT_LESSON_ACTION: {
            let {
                lessonId,
                commentId
            } = action.payload;

            return updateComment(state, lessonId, commentId)(({isNew, ...comment}) => ({
                ...comment
            }));
        }
        default:
            return state;
    }
    return state;
}

export default userReducer;