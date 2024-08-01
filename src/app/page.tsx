'use client';
import { Col, Form, Row } from '@douyinfe/semi-ui';
import { Editor } from './components/editor';
import { Preview } from './components/preview';

import styles from './page.module.scss';

export default function App() {
  return (
    <Form className={styles.layout}>
      <Row className={styles.layout}>
        <Col span={8} className={styles.sider}>
          <Editor />
        </Col>
        <Col span={16} className={styles.main}>
          <div className={styles.container}>
            <Preview />
          </div>
        </Col>
      </Row>
    </Form>
  );
}
