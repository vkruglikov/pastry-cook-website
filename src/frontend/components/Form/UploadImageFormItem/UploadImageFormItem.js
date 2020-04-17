import React, {useCallback, useMemo, useRef, useState} from "react";
import axios from "axios";
import {Button, message, Modal, Upload} from "antd";
import ReactCrop from "react-image-crop";
import {UploadOutlined} from '@ant-design/icons';

const UploadImageFormItem = ({accept, value, onChange, aspect = 390 / 130, minSelectedWidth = 390, minSelectedHeight = 130} = {}) => {
    const [showCropModal, setShowCropModal] = useState(false);
    const [upImg, setUpImg] = useState();
    const [isFetching, setIsFetching] = useState();
    const [fileImage, setFileImage] = useState();
    const refCropImage = useRef();
    const [crop, setCrop] = useState();

    const onSelectFile = e => {
        const file = e.file.originFileObj;

        if (!accept.includes(file.type)) {
            message.error(`Допустимые типы файлов: ${accept.join(', ')}`);
            return;
        }
        if (file.size / 1024 / 1024 > 2) {
            message.error('Файл не может быть больше 2 MB');
            return;
        }
        setFileImage(file);

        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            setUpImg(e.target.result);
            setShowCropModal(true);
        });
        reader.readAsDataURL(file);
    };

    const onImageLoaded = useCallback(img => {
        refCropImage.current = img;

        const width = img.width > img.height ? 100 : ((img.height * aspect) / img.width) * 100;
        const height = img.height > img.width ? 100 : (img.width / aspect / img.height) * 100;
        const y = (100 - height) / 2;
        const x = (100 - width) / 2;

        setCrop({
            unit: '%',
            width,
            x,
            y,
            aspect,
        });

        return false; // Return false if you set crop state in here.
    }, []);

    const naturalSelected = useMemo(() => {
        if (!crop) return {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        };

        return {
            width: refCropImage.current.naturalWidth / 100 * crop.width,
            height: refCropImage.current.naturalHeight / 100 * crop.height,
            x: (refCropImage.current.naturalWidth / 100) * crop.x,
            y: (refCropImage.current.naturalHeight / 100) * crop.y,
        }
    }, [crop, refCropImage]);

    const okButtonDisabled = naturalSelected.width < minSelectedWidth || isFetching;

    const saveImage = useCallback(async () => {
        let data = new FormData();
        data.set("crop", encodeURIComponent(JSON.stringify({
            x: naturalSelected.x,
            y: naturalSelected.y,
            width: naturalSelected.width,
            height: naturalSelected.height,
        })));
        data.set("resize", encodeURIComponent(JSON.stringify({
            width: minSelectedWidth,
            height: minSelectedHeight,
        })));
        data.append('file', fileImage);

        setIsFetching(true);
        try {
            message.info('Выполняется загрузка изображения');
            const result = await axios({
                method: 'post',
                url: '/upload/image',
                data: data,
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            })
            onChange({
                id: result.data.id,
                url: result.data.url,
            });
            message.success(`Изображение успешно загружено`);
        } catch (e) {
            message.error(`Ошибка загрузки`);
            console.error(e);
        }

        setShowCropModal(false);
        setIsFetching(false);
    }, [fileImage, naturalSelected]);

    return (
        <>
            {value && (
                <div>
                    <img style={{
                        border: '1px solid rgb(217, 217, 217)',
                        padding: '10px',
                        margin: '10px 0',
                        maxHeight: '130px',
                        maxWidth: '100%'
                    }} src={value.url}/>
                </div>
            )}
            <Upload
                accept={accept.join(',')}
                onChange={onSelectFile}
                customRequest={({_, onSuccess}) => onSuccess('ok')}
                showUploadList={false}
            >
                <Button>
                    <UploadOutlined/> Выберите файл
                </Button>
            </Upload>
            <Modal
                title="Выберите область отображения"
                visible={showCropModal}
                okText={'Сохранить'}
                cancelText={'Отменить'}
                okButtonProps={{
                    loading: isFetching
                }}
                onOk={saveImage}
                onCancel={() => setShowCropModal(false)}
            >
                <ReactCrop
                    src={upImg}
                    onImageLoaded={onImageLoaded}
                    crop={crop}
                    onChange={(_, cropPercent) => {
                        if (!cropPercent.width || !cropPercent.height) {
                            return;
                        }

                        setCrop(cropPercent);
                    }}
                />
            </Modal>
        </>
    );
};

export default UploadImageFormItem;