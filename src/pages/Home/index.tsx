import { useNavigate } from 'react-router-dom'
import { serverPath } from '@/server/config'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'

const Home = () => {

  const navigate = useNavigate()

  return (
    <Fragment>
      <Helmet>
        <title>简易服务端渲染 Home</title>
        <meta name='desciption' content='服务端渲染' />
      </Helmet>
      <div>
        <h1>hello home</h1>
        <button
          onClick={(): void => {
            alert("hello ssr home")
          }}
        >
          alert
        </button>

        {/* 首次加载会报错 */}
        <a href={serverPath + '/demo'}>链接跳转</a>
        {/* <a href="http://127.0.0.1:3000/demo">链接跳转</a>  */}
        <span
          onClick={(): void => {
            navigate('/demo')
          }}
        >
          路由跳转
        </span>
      </div>
    </Fragment>

  )
}

export default Home