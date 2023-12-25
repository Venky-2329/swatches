import { Carousel } from 'antd';
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
      <Carousel autoplay afterChange={onChange}>
        {data.map((i) => {
          return (
            <div>
              <img
                style={{ height: '10%', objectFit: 'cover' }}
                src={
                  'http://172.20.50.169/design_room/dist/services/kanban-service/upload-files/' +
                  i.fileName
                }
              ></img>
            </div>
          );
        })}
      </Carousel>
    </>
  );
}
