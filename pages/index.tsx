import { useState } from 'react';
import Head from 'next/head';
import Form from 'rc-field-form';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  TopAppBarFixedAdjust,
} from '@rmwc/top-app-bar';
import { Grid, GridCell } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { Select } from '@rmwc/select';
import dayjs from 'dayjs';

import styles from './index.module.css';

import '@rmwc/icon/icon.css';
import '@material/top-app-bar/dist/mdc.top-app-bar.css';
import '@material/icon-button/dist/mdc.icon-button.css';
import '@material/ripple/dist/mdc.ripple.css';
import '@material/layout-grid/dist/mdc.layout-grid.css';
import '@material/button/dist/mdc.button.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@material/notched-outline/dist/mdc.notched-outline.css';
import '@material/line-ripple/dist/mdc.line-ripple.css';
import '@rmwc/select/select.css';
import '@material/select/dist/mdc.select.css';

export default function Home() {
  const [form] = Form.useForm<{
    list: {
      type: string;
      title: string;
      date: string;
    }[];
  }>();

  const [icsURL, setIcsURL] = useState('');

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <TopAppBar>
        <TopAppBarRow>
          <TopAppBarSection alignStart>
            <TopAppBarTitle>农历纪念日订阅</TopAppBarTitle>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust />
      <Grid>
        <GridCell desktop={4} tablet={2} phone={4} />
        <GridCell span={4}>
          <Form
            form={form}
            onFinish={(value) => {
              if (!value.list.length) {
                setIcsURL('');
                return;
              }
              const params = new URLSearchParams();
              value.list.forEach((item) => {
                params.append(
                  'd',
                  `${item.title},${item.type},${dayjs(item.date).format(
                    'YYYY,M,D'
                  )}`
                );
              });
              const url = new URL('/api/ics', window.location.origin);
              url.search = params.toString();
              setIcsURL(url.toString());
            }}>
            <Form.List name="list" initialValue={[{ title: '' }]}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key} className={styles.row}>
                        <div className={styles.main}>
                          <Form.Field name={[field.name, 'type']}>
                            <Select
                              className={styles.type}
                              label="类型"
                              options={[
                                { label: '生日', value: 'b' },
                                { label: '忌日', value: 'd' },
                              ]}
                              required
                            />
                          </Form.Field>
                          <Form.Field name={[field.name, 'title']}>
                            <TextField
                              className={styles.title}
                              label="称谓"
                              required
                            />
                          </Form.Field>
                        </div>
                        <Form.Field name={[field.name, 'date']}>
                          <TextField
                            className={styles.date}
                            type="date"
                            label="日期"
                            required
                          />
                        </Form.Field>
                        {fields.length > 1 && (
                          <Button
                            className={styles.button}
                            outlined
                            ripple
                            icon="remove"
                            onClick={() => remove(index)}>
                            删除
                          </Button>
                        )}
                      </div>
                    ))}
                    <div className={styles.row}>
                      <Button
                        className={styles.button}
                        outlined
                        ripple
                        icon="add"
                        onClick={() => add()}>
                        添加新纪念日
                      </Button>
                    </div>
                  </>
                );
              }}
            </Form.List>
            <Button
              className={styles.button}
              raised
              ripple
              trailingIcon="keyboard_arrow_right"
              type="submit">
              生成订阅地址
            </Button>
          </Form>
          {icsURL && (
            <TextField
              textarea
              fullwidth
              value={icsURL}
              style={{ marginTop: '48px' }}
            />
          )}
        </GridCell>
      </Grid>
    </>
  );
}
