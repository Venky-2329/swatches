import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt } from '@fortawesome/free-solid-svg-icons';
import { Row, Spin } from 'antd'
import './custom-spinner.css';


/* eslint-disable-next-line */
export interface CustomSpinnerProps {
    loading: boolean;
}

export function CustomSpinner(
    props: CustomSpinnerProps
) {
    const { loading } = props;
    return (
        loading ? (
            <div className='loader'>
              <Row justify='space-around' className='row'>
                <div className='shirt-spinner'>
                  <FontAwesomeIcon icon={faShirt} className='shirt-icon' />
                </div>
              </Row>
            </div>
          ) : <></>
    );
}

export default CustomSpinner;
