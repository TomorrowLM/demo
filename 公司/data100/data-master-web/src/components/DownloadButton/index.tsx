import React, { useEffect, useState } from 'react';
import { request } from 'umi';
import { encode } from 'js-base64';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { objToQueryParams } from '@/utils/utils';
// import Parabola from '@/utils/parabola';

interface DownloadButtonProps {
  text?: string,
  path: string,
  params?: object,
  type?: string,
  downloadCenter?: boolean
}

// let parabola: Parabola | null = null;

const DownloadButton: React.FC<DownloadButtonProps> = (props) => {
  const { text = '下载', path, params = {}, type, downloadCenter = false } = props;
  const [ disabled, setDisabled ] = useState<boolean>(false);

  useEffect(() => {
    // if (downloadCenter) {
    //   parabola = new Parabola({
    //     origin: '.downloadParabola',
    //     target: '.downloadCenter',
    //     element: '.moveParabola'
    //   });
    // }
  }, [])

  const download = async () => {
    setDisabled(true);
    const authorization = window.localStorage.getItem('authorization');
    const token = encode(authorization || '');
    const url = `download/${path}?${objToQueryParams({ ...params, token })}`;
    if (downloadCenter) {
      request(url).then(() => {
        message.success('已提交，请在下载中心查看下载进度！');
        // parabola?.move();
      });
    } else if (path.includes('http')) {
      window.location.href = path;
    } else {
      window.location.href = `${process.env.PROXY_API}${url}`;
    }
    const tim = setTimeout(() => {
      setDisabled(false);
      clearTimeout(tim);
    }, 3000)
  }

  return (
    type === 'text' ?
    <a className='downloadParabola' key='download' onClick={() => download()}><DownloadOutlined /> { text }</a> :
    <Button disabled={disabled} className='downloadParabola' key='download' icon={<DownloadOutlined />} onClick={() => download()}>{ text }</Button>
  )
}

export default DownloadButton;