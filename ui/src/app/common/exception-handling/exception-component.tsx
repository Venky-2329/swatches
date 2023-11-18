

import { Button, Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import { useNavigate, useRouteError } from 'react-router-dom';
interface PropForException {
  statusCode: ResultStatusType,
  statusMessage: string,
}
export const ExceptionComponent = (props: PropForException) => {
  let navigate = useNavigate();
  let error: any = useRouteError();
  console.log(error)
  return (
    <>
      {error ? <Result
        status={error.status}
        title={error.statusText}
        subTitle={error.data}
        extra={<Button type='primary' onClick={() => navigate('/')}>Back Home</Button>}
      /> : <Result
        status={"error"}
        title={"Something went wrong"}
        subTitle={""}
        extra={<Button type='primary' onClick={() => navigate('/')}>Back Home</Button>} />}
    </>
  );
}
// export default LogOut;