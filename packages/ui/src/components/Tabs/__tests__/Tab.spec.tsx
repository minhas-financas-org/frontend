// import { render } from '@testing-library/react';

// import Tab from '../TabButton';

// describe('Tab', () => {
//     it('Should render component correctly', () => {
//         const { getByTestId } = render(<Tab data-testid="first-tab" label="Primeira Aba" />);

//         expect(getByTestId('first-tab')).toBeInTheDocument();
//         expect(getByTestId('first-tab')).toHaveTextContent('Primeira Aba');
//     });

//     it('Should be highlighted when checked prop is true', () => {
//         const { getByTestId } = render(<Tab data-testid="second-tab" label="Segunda Aba" aria-checked />);

//         expect(getByTestId('second-tab')).toHaveClass('active');
//     });

//     it('Should not be highlighted when checked prop is false', () => {
//         const { getByTestId } = render(<Tab data-testid="third-tab" label="Terceira Aba" />);

//         expect(getByTestId('third-tab')).not.toHaveClass('active');
//     });

//     it('Should receive a custom class', () => {
//         const { getByTestId } = render(<Tab data-testid="fourth-tab" label="Terceira Aba" className="custom-class" />);

//         expect(getByTestId('fourth-tab')).toHaveClass('custom-class');
//     });
// });
