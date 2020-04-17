import React, {useEffect, useRef} from 'react';
import {Button} from "antd";
import ReactGA from 'react-ga';
import {useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";

import {USER_AUTH_DATA} from "../../redux/userReducer";

import VkIcon from './vk.react.svg';
import FbIcon from './facebook.react.svg';
import GoogleIcon from './google.react.svg';

import styles from './SocialLoginButton.module.css';

const getVkUrl = (type, state) => `/login/${type}/auth?state=${JSON.stringify(state)}`;

const openWindow = (type, location) => {
    return window.open(getVkUrl(type, {
        target: `${location.pathname}${location.search}${location.hash}`,
        display: 'popup',
    }), 'vkSocialAuth', `height=${window.innerHeight},width=${window.innerWidth}`)
}

// TODO Теперь это уже не кнопка, а форма
const SocialLoginButton = ({children, ...rest}) => {
    const location = useLocation();
    const windowOpenRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        window.addEventListener('message', (e) => {
            try {
                const data = JSON.parse(e.data) || {};
                if (data.type !== 'authPostFromPopupAuth') {
                    throw new Error();
                }

                windowOpenRef.current.close();
                windowOpenRef.current = null;

                if (data.result === 'success') {
                    dispatch({
                        type: USER_AUTH_DATA,
                        payload: {
                            first_name: data.data.first_name,
                            last_name: data.data.last_name,
                            login: data.data.login,
                            photo: data.data.photo,
                            social_vk_id: data.data.social_vk_id,
                            social_fb_id: data.data.social_fb_id,
                            user_id: data.data.user_id,
                        }
                    });
                }
            } catch (e) {

            }
        });
    }, [dispatch]);

    const onClick = (type) => () => {
        if (windowOpenRef.current) {
            windowOpenRef.current.close();
            windowOpenRef.current = null;
        }
        ReactGA.event({
            category: 'user',
            action: 'Social auth click'
        });

        windowOpenRef.current = openWindow(type, location);
    };

    return (
        <>
            {/*<Dropdown overlay={menu} placement={"bottomCenter"}>*/}
            <Button {...rest} onClick={onClick('vk')} size={'large'}>
                <div className={styles.buttonInnerWrapper}>
                    <div className={styles.socialIconsWrapper}>
                        <VkIcon fill={'#4a75a8'} width={24} height={24}/>
                    </div>
                    <div className={styles.buttonInnerText}>
                        Войти через вконтакте
                    </div>
                </div>
            </Button>
            <Button {...rest} onClick={onClick('facebook')} size={'large'} style={{
                marginTop: '5px'
            }}>
                <div className={styles.buttonInnerWrapper}>
                    <div className={styles.socialIconsWrapper}>
                        <FbIcon fill={'#4a75a8'} width={24} height={24}/>
                    </div>
                    <div className={styles.buttonInnerText}>
                        Войти через facebook
                    </div>
                </div>
            </Button>
            <Button {...rest} onClick={onClick('google')} size={'large'} style={{
                marginTop: '5px'
            }}>
                <div className={styles.buttonInnerWrapper}>
                    <div className={styles.socialIconsWrapper}>
                        <GoogleIcon fill={'#4a75a8'} width={24} height={24}/>
                    </div>
                    <div className={styles.buttonInnerText}>
                        Войти через google
                    </div>
                </div>
            </Button>
            {/*</Dropdown>*/}
        </>
    )
}

export default SocialLoginButton;