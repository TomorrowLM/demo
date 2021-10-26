import { Breadcrumb } from 'antd';
import React from 'react';
import { Link } from 'umi';
interface GeneralBreadcrumbProps {
  data: Array<any>,
  
}
const GeneralBreadcrumb: React.FC<GeneralBreadcrumbProps> = (props) => {
  const { data} = props;
  // console.log(props)
  return (
    <Breadcrumb style={{margin:"0 0 10px"}}>
      {data.map((item,index)=>{
        return <Breadcrumb.Item key={index}>{item.path?<Link to={item.path}><span>{item.name}</span></Link>:item.name}</Breadcrumb.Item>
      })}
    </Breadcrumb>
  )
}

export default GeneralBreadcrumb;