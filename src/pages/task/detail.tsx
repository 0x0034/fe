import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Spin, Divider, Button, Card } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import Highlight from 'react-highlight';
import 'highlight.js/styles/vs2015.css';
import moment from 'moment';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/common';
import { CommonStoreState } from '@/store/commonInterface';
import request from '@/utils/request';
import api from '@/utils/api';
import PageLayout from '@/components/pageLayout';
import './style.less';


const Detail = (props: any) => {
  const history = useHistory();
  const { curBusiItem } = useSelector<RootState, CommonStoreState>((state) => state.common);
  const { t } = useTranslation();
  const taskId = _.get(props, 'match.params.id');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({} as any);

  useEffect(() => {
    if (taskId !== undefined) {
      setLoading(true);
      request(`${api.task(curBusiItem.id)}/${taskId}`).then((data) => {
        setData({
          ...data.dat.meta,
          hosts: _.map(data.dat.hosts, (host) => {
            return host.host;
          }),
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [taskId]);

  return (
    <PageLayout hideCluster title={
      <>
        <RollbackOutlined className='back' onClick={() => history.push('/job-tasks')} />
        执行历史
      </>
    }>
      <div style={{ padding: 10 }}>
        <Card
          title={data.title}
        >
        <Spin spinning={loading}>
          <div className="job-task-table">
            <div className="ant-table ant-table-default ant-table-bordered">
              <div className="ant-table-content">
                <div className="ant-table-body">
                  <table>
                    <colgroup>
                      <col style={{ width: 100, minWidth: 100 }} />
                      <col />
                    </colgroup>
                    <tbody className="ant-table-tbody">
                      <tr className="ant-table-row ant-table-row-level-0">
                        <td>{t('task.title')}</td>
                        <td>{data.title}</td>
                      </tr>
                      <tr className="ant-table-row ant-table-row-level-0">
                        <td>{t('task.creator')}</td>
                        <td>{data.creator} @ {moment(data.created).format('YYYY-MM-DD HH:mm:ss')}</td>
                      </tr>
                      <tr className="ant-table-row ant-table-row-level-0">
                        <td>{t('task.control.params')}</td>
                        <td>
                          {t('task.account')}：{data.account}
                          <Divider type="vertical" />
                          {t('task.batch')}：{data.batch}
                          <Divider type="vertical" />
                          {t('task.tolerance')}：{data.tolerance}
                          <Divider type="vertical" />
                          {t('task.timeout')}：{data.timeout}
                        </td>
                      </tr>
                      <tr className="ant-table-row ant-table-row-level-0">
                        <td>{t('task.script')}</td>
                        <td>
                          <Highlight className="bash">
                            {data.script}
                          </Highlight>
                        </td>
                      </tr>
                      <tr className="ant-table-row ant-table-row-level-0">
                        <td>{t('task.script.args')}</td>
                        <td>{data.args}</td>
                      </tr>
                      <tr className="ant-table-row ant-table-row-level-0">
                        <td>{t('task.pause')}</td>
                        <td>{data.pause}</td>
                      </tr>
                      <tr className="ant-table-row ant-table-row-level-0">
                        <td>{t('task.host.list')}</td>
                        <td>
                          {
                            _.map(data.hosts, (host) => {
                              return <div key={host}>{host}</div>;
                            })
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Link to={{ pathname: '/job-tasks/add', search: `task=${taskId}` }}>
              <Button type="primary">{t('task.clone.new')}</Button>
            </Link>
            <Link style={{ marginLeft: 8 }} to={{ pathname: `/job-tasks` }}>
              <Button>返回</Button>
            </Link>
          </div>
        </Spin>
      </Card>
      </div>
    </PageLayout>
  );
};

export default Detail;