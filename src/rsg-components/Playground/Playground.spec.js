import React from 'react';
import PropTypes from 'prop-types';
import Playground from './Playground';
import '../../styles/setupjss';
import { EXAMPLE_TAB_CODE_EDITOR } from '../../plugins/code-editor';
import { PlaygroundRenderer } from './PlaygroundRenderer';

/* eslint-disable react/prop-types */

const code = '<button>OK</button>';
const newCode = '<button>Not OK</button>';
const options = {
	context: {
		config: {
			showCode: false,
			highlightTheme: 'base16-light',
		},
		slots: {
			exampleToolbarButton: [],
			exampleTab: [
				{
					id: EXAMPLE_TAB_CODE_EDITOR,
					render: () => <div className="ReactCodeMirror">editor</div>,
				},
			],
			exampleTabButton: [
				{
					id: EXAMPLE_TAB_CODE_EDITOR,
					render: ({ onClick, id }) => <button name={id} onClick={onClick}>code</button>,
				},
			],
		},
	},
	childContextTypes: {
		slots: PropTypes.object.isRequired,
	},
};

it('should render component renderer', () => {
	const actual = shallow(
		<Playground code={code} evalInContext={a => () => a} name="name" index={0} />,
		options
	);

	expect(actual).toMatchSnapshot();
});

it('should update code via props', () => {
	const actual = shallow(
		<Playground code={code} evalInContext={a => () => a} name="name" index={0} />,
		options
	);

	expect(actual.state('code')).toEqual(code);

	actual.setProps({
		code: newCode,
	});

	expect(actual.state('code')).toEqual(newCode);
});

it('should update code with debounce', done => {
	const actual = shallow(<Playground code={code} evalInContext={a => a} name="name" index={0} />, {
		context: {
			...options.context,
			config: {
				...options.context.config,
				previewDelay: 1,
			},
		},
	});

	expect(actual.state('code')).toEqual(code);

	actual.instance().handleChange(newCode);

	expect(actual.state('code')).toEqual(code);
	setTimeout(() => {
		expect(actual.state('code')).toEqual(newCode);
		done();
	}, 3);
});

it('should open a code editor', () => {
	const actual = mount(
		<Playground code={code} evalInContext={a => () => a} name="name" index={0} />,
		options
	);

	expect(actual.find('.ReactCodeMirror')).toHaveLength(0);

	actual.find(`button[name="${EXAMPLE_TAB_CODE_EDITOR}"]`).simulate('click');

	expect(actual.find('.ReactCodeMirror')).toHaveLength(1);
});

it('renderer should render preview', () => {
	const actual = shallow(
		<PlaygroundRenderer
			classes={{}}
			name="name"
			preview={<div>preview</div>}
			tabButtons={<div>tab buttons</div>}
			tabBody={<div>tab body</div>}
			toolbar={<div>toolbar</div>}
		/>
	);

	expect(actual).toMatchSnapshot();
});
