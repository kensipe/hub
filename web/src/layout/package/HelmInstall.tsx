import classnames from 'classnames';
import isUndefined from 'lodash/isUndefined';
import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { Repository } from '../../types';
import ButtonCopyToClipboard from '../common/ButtonCopyToClipboard';
import ExternalLink from '../common/ExternalLink';
import NoData from '../common/NoData';
import styles from './ContentInstall.module.css';

interface Props {
  name: string;
  version?: string;
  repository: Repository;
}

interface Tab {
  name: string;
  title: string;
}

const TABS: Tab[] = [
  {
    name: 'v3',
    title: 'Helm v3',
  },
  {
    name: 'v2',
    title: 'Helm v2',
  },
];
const ACTIVE_TAB: string = 'v3';

const HelmInstall = (props: Props) => {
  const [activeTab, setActiveTab] = useState(ACTIVE_TAB);

  if (isUndefined(props.version)) return null;

  return (
    <>
      <ul className={`nav nav-tabs ${styles.tabs}`}>
        {TABS.map((tab: Tab) => (
          <li className="nav-item" key={tab.name}>
            <button
              className={classnames('btn btn-link nav-item', styles.btn, {
                [`active btn-primary ${styles.active}`]: tab.name === activeTab,
              })}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.title}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content mt-3">
        {(() => {
          const block1 = `helm repo add ${props.repository.name} ${props.repository.url}`;

          switch (activeTab) {
            case 'v3':
              const block2 = `helm install my-${props.name} ${props.repository.name}/${props.name} --version ${props.version}`;

              return (
                <div className="tab-pane fade show active">
                  <div className="d-flex align-items-center justify-content-between mt-2 mb-2">
                    <small className="text-muted mt-2 mb-1">Add repository</small>
                    <div>
                      <ButtonCopyToClipboard text={block1} />
                    </div>
                  </div>

                  <SyntaxHighlighter
                    language="bash"
                    style={docco}
                    customStyle={{
                      backgroundColor: 'var(--color-1-10)',
                    }}
                  >
                    {block1}
                  </SyntaxHighlighter>

                  <div className="d-flex align-items-center justify-content-between mt-2 mb-2">
                    <small className="text-muted mt-2 mb-1">Install chart</small>
                    <div>
                      <ButtonCopyToClipboard text={block2} />
                    </div>
                  </div>

                  <SyntaxHighlighter
                    language="bash"
                    style={docco}
                    customStyle={{
                      backgroundColor: 'var(--color-1-10)',
                      marginBottom: '10px',
                    }}
                  >
                    {block2}
                  </SyntaxHighlighter>

                  <div className={`font-italic text-muted ${styles.legend}`}>
                    <span className="font-weight-bold">my-{props.name}</span> corresponds to the release name, feel free
                    to change it to suit your needs. You can also add additional flags to the{' '}
                    <span className="font-weight-bold">helm install</span> command if you need to.
                  </div>

                  <div className="mt-2">
                    <ExternalLink href="https://helm.sh/docs/intro/quickstart/" className="btn btn-link pl-0">
                      Need Helm?
                    </ExternalLink>
                  </div>
                </div>
              );

            case 'v2':
              const block2V2 = `helm install --name my-${props.name} ${props.repository.name}/${props.name} --version ${props.version}`;

              return (
                <div className="tab-pane fade show active">
                  <div className="d-flex align-items-center justify-content-between mt-2 mb-2">
                    <small className="text-muted mt-2 mb-1">Add repository</small>
                    <div>
                      <ButtonCopyToClipboard text={block1} />
                    </div>
                  </div>

                  <SyntaxHighlighter
                    language="bash"
                    style={docco}
                    customStyle={{
                      backgroundColor: 'var(--color-1-10)',
                    }}
                  >
                    {block1}
                  </SyntaxHighlighter>

                  <div className="d-flex align-items-center justify-content-between mt-2 mb-2">
                    <small className="text-muted mt-2 mb-1">Install chart</small>
                    <div>
                      <ButtonCopyToClipboard text={block2V2} />
                    </div>
                  </div>

                  <SyntaxHighlighter
                    language="bash"
                    style={docco}
                    customStyle={{
                      backgroundColor: 'var(--color-1-10)',
                      marginBottom: '10px',
                    }}
                  >
                    {block2V2}
                  </SyntaxHighlighter>

                  <div className={`font-italic text-muted ${styles.legend}`}>
                    <span className="font-weight-bold">my-{props.name}</span> corresponds to the release name, feel free
                    to change it to suit your needs. You can also add additional flags to the{' '}
                    <span className="font-weight-bold">helm install</span> command if you need to.
                  </div>

                  <div className="mt-2">
                    <ExternalLink href="https://helm.sh/docs/intro/quickstart/" className="btn btn-link pl-0">
                      Need Helm?
                    </ExternalLink>
                  </div>
                </div>
              );
            default:
              return (
                <div className="tab-pane fade show active">
                  <NoData>Sorry, the information for Install is missing.</NoData>
                </div>
              );
          }
        })()}
      </div>
    </>
  );
};

export default HelmInstall;
