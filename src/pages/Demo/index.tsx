import { FC, Fragment } from "react";
// import axios from 'axios'
import {connect} from 'react-redux'
import { getDemoData } from "./store/demoReducer";
import {Helmet} from 'react-helmet'

export interface IProps {
  content?: string;
  getDemoData?: (data: string) => void
}

const Demo: FC<IProps> = (data) => {
  // return (
  //   <div>this is a demo page</div>
  // )
  return (
    <Fragment>
      <Helmet>
        <title>简易服务端渲染-Demo</title>
        <meta name="description" content="服务端渲染框架"></meta>
      </Helmet>
      <div>
        <h1>{data.content}</h1>
        <button
          onClick={(): void => {
            data.getDemoData && data.getDemoData('刷新后的数据')
          }}
        >
          刷新
        </button>
      </div>
    </Fragment>
  )
}

const mapStateToProps = (state: any) => {
  // 将对应的reducer的内容传回dom
  return {
    content: state?.demo?.content
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getDemoData: (data: string) => {
      dispatch(getDemoData(data))
    }
  }
}

const storeDemo:any = connect(mapStateToProps, mapDispatchToProps)(Demo)
storeDemo.getInitProps = (store: any, data?: string) => {
  return store.dispatch(getDemoData(data || 'this is init data'))
}
export default storeDemo
