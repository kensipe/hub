import { render } from '@testing-library/react';
import React from 'react';

import SecurityReport from './index';

const defaultProps = {
  summary: {
    low: 53,
    critical: 2,
    medium: 105,
    high: 10,
    unknown: 9,
  },
  packageId: 'pkgID',
  version: '1.1.1',
};

describe('SecurityReport', () => {
  it('creates snapshot', () => {
    const result = render(<SecurityReport {...defaultProps} />);
    expect(result.asFragment()).toMatchSnapshot();
  });

  describe('Render', () => {
    it('renders component', () => {
      const { getByText, getAllByTestId } = render(<SecurityReport {...defaultProps} />);
      expect(getByText('Security Report')).toBeInTheDocument();
      expect(getByText('179')).toBeInTheDocument();
      expect(getByText(/vulnerabilities found/g)).toBeInTheDocument();

      const items = getAllByTestId('summaryItem');
      expect(items).toHaveLength(5);
      expect(items[0]).toHaveTextContent('critical2');
      expect(items[1]).toHaveTextContent('high10');
      expect(items[2]).toHaveTextContent('medium105');
      expect(items[3]).toHaveTextContent('low53');
      expect(items[4]).toHaveTextContent('unknown');

      const badges = getAllByTestId('summaryBadge');
      expect(badges[0]).toHaveStyle('background-color: #B20303');
      expect(badges[1]).toHaveStyle('background-color: #ff5152');
      expect(badges[2]).toHaveStyle('background-color: #ffb760');
      expect(badges[3]).toHaveStyle('background-color: #ffe258');
      expect(badges[4]).toHaveStyle('background-color: #b2b2b2');

      expect(getByText('Open full report')).toBeInTheDocument();
    });

    it('renders component with 0 vulnerabilities', () => {
      const props = {
        ...defaultProps,
        summary: {
          low: 0,
          critical: 0,
          medium: 0,
          high: 0,
          unknown: 0,
        },
      };
      const { getByText, queryByText } = render(<SecurityReport {...props} />);

      expect(getByText('Security Report')).toBeInTheDocument();
      expect(getByText('No vulnerabilities found')).toBeInTheDocument();
      expect(queryByText('Open full report')).toBeNull();
    });
  });

  describe('Does not render component', () => {
    it('when summary is null', () => {
      const { container } = render(<SecurityReport summary={null} packageId="pkgID" version="1.1.1" />);
      expect(container).toBeEmptyDOMElement();
    });

    it('when summary is empty', () => {
      const { container } = render(<SecurityReport summary={{}} packageId="pkgID" version="1.1.1" />);
      expect(container).toBeEmptyDOMElement();
    });
  });
});
