import DropTarget, {DRAG_TYPES} from '../DropTarget';

const mockEventObj = {
	preventDefault() {}
};

describe('DropTarget', () => {
	let component;

	afterEach(() => {
		if (component) {
			component.dispose();
		}
	});

	it('renders', () => {
		component = new DropTarget();

		expect(component).toMatchSnapshot();
	});

	it('should call handleDragEnd', () => {
		component = new DropTarget();

		const spy = jest.fn();

		component.handleDragEnd = spy;

		component.handleDocumentDrop(mockEventObj);

		expect(spy).toBeCalled();
	});

	it('should reset state if currently dragging', () => {
		component = new DropTarget();

		component.state.dragging = true;
		component.state.hoverOver = true;

		component.handleDragEnd();

		expect(component.state.dragging).toBe(false);
		expect(component.state.hoverOver).toBe(false);
	});

	it('should set dragging to true if matches file type', () => {
		component = new DropTarget({
			targetType: DRAG_TYPES.FILE
		});

		component.handleDragEnter({
			dataTransfer: {
				types: ['text/html']
			}
		});

		expect(component.state.dragging).toBe(false);

		component.handleDragEnter({
			dataTransfer: {
				types: ['Files']
			}
		});

		expect(component.state.dragging).toBe(true);
	});

	it('should call onDrop and handleDragEnd', () => {
		const spy1 = jest.fn();
		const spy2 = jest.fn();

		component = new DropTarget({
			onDrop: spy1
		});

		component.handleDragEnd = spy2;
		component.state.dragging = true;

		component.handleTargetDrop(mockEventObj);

		expect(spy1).toBeCalled();
		expect(spy2).toBeCalled();
	});

	it('should set hoverOver to true if dragging', () => {
		component = new DropTarget();

		component.handleTargetEnter(mockEventObj);

		expect(component.state.hoverOver).toBe(false);

		component.state.dragging = true;

		component.handleTargetEnter(mockEventObj);

		expect(component.state.hoverOver).toBe(true);
	});

	it('should set hoverOver to false', () => {
		component = new DropTarget();

		component.state.dragging = true;
		component.state.hoverOver = true;

		component.handleTargetLeave();

		expect(component.state.hoverOver).toBe(false);
	});

	it('should call preventDefault if dragging', () => {
		const spy = jest.fn();

		component = new DropTarget();

		component.state.dragging = true;

		component.handlePreventDefault({
			preventDefault: spy
		});

		expect(spy).toBeCalled();
	});
});
