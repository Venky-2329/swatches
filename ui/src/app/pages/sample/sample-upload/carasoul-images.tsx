import { Carousel  } from 'antd';
import { getAllSamplesData } from 'libs/shared-services';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAll();
  }, []);

  function getAll() {
    getAllSamplesData().then((res) => {
      if (res.data) {
        setData(res.data);
        // notification.success({ message: res.internalMessage });
      } else {
        // notification.error({ message: res.internalMessage });
      }
    });
  }

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <>
      <Carousel autoplay afterChange={onChange} dotPosition={'right'}>
        {data.map((i) => {
          return (
            <div className='image-container' style={{color:'black'}}>
              <img
                style={{
                  width: '100%',
                  height: '90vh', // Adjust as needed
                  objectFit: 'contain',
                  background:'rgb(0 0 0 / 59%)'
                }}
                src={
                  'http://ddr7.shahi.co.in/design_room/dist/services/kanban-service/upload-files/' +
                  i.fileName
                }
              ></img>
              {/* <h1 style={{position:'absolute',top:'50%',left:'45%',zIndex:10}}>Welcome Digital Studio</h1> */}
            </div>
          );
        })}
      </Carousel>
    </>
  );
}
