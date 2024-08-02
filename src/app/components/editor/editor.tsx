'use client';
import { commonDisabledDate } from '@/app/constants/common';
import { IconMinusCircle, IconPlus } from '@douyinfe/semi-icons';
import { ArrayField, Button, Card, Col, Form, Popconfirm, Row, Space } from '@douyinfe/semi-ui';
import { Subscription } from '../subscription';
import { ImportIcs } from '../import-ics';

import styles from './editor.module.scss';

const DEFAULT_TEMP = '{{years}} 周年纪念日';

export const Editor: React.FC = () => {
  return (
    <ArrayField field='days' initValue={[{ temp: DEFAULT_TEMP }]}>
      {({ arrayFields, addWithInitValue }) => {
        return (
          <div className={styles.container}>
            <div className={styles.main}>
              {arrayFields.map((item) => (
                <Card key={item.key} className={styles.item}>
                  <Row type='flex' justify='space-between'>
                    <Col>
                      <Form.DatePicker field={`${item.field}[day]`} label='日期（公历）' disabledDate={commonDisabledDate} />
                    </Col>
                    <Col>
                      <Popconfirm title='确定删除？' content='此操作不可逆' onConfirm={item.remove}>
                        <Button type='danger' theme='borderless' icon={<IconMinusCircle />} />
                      </Popconfirm>
                    </Col>
                  </Row>
                  <Form.Input field={`${item.field}[temp]`} label='事件模板' extraText='支持 {{years}} 变量，用于表示距离开始日期的年份' />
                </Card>
              ))}
            </div>
            <div className={styles.toolbar}>
              <Space>
                <Button icon={<IconPlus />} onClick={() => addWithInitValue({ temp: DEFAULT_TEMP })}>
                  添加新纪念日
                </Button>
                <ImportIcs />
              </Space>
              <Subscription />
            </div>
          </div>
        );
      }}
    </ArrayField>
  );
};
