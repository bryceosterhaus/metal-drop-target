import Component, {Config} from 'metal-jsx';
import Transition from 'metal-css-transitions';

export const DRAG_TYPES = {
	FILE: 'Files',
	HTML: 'text/html',
	TEXT: 'text/plain',
	URL: 'text/uri-list'
};

class DropTarget extends Component {
	created() {
		this.handleDocumentDrop = this.handleDocumentDrop.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
		this.handleDragEnter = this.handleDragEnter.bind(this);
		this.handlePreventDefault = this.handlePreventDefault.bind(this);
		this.handleTargetDrop = this.handleTargetDrop.bind(this);
		this.handleTargetEnter = this.handleTargetEnter.bind(this);
		this.handleTargetLeave = this.handleTargetLeave.bind(this);
	}

	attached() {
		const {container} = this.props;

		container.addEventListener('dragend', this.handleDragEnd);
		container.addEventListener('dragenter', this.handleDragEnter);
		container.addEventListener('dragover', this.handlePreventDefault);
		container.addEventListener('drop', this.handleDocumentDrop);
		container.addEventListener('mouseleave', this.handleDragEnd);
	}

	detached() {
		const {container} = this.props;

		container.removeEventListener('dragend', this.handleDragEnd);
		container.removeEventListener('dragenter', this.handleDragEnter);
		container.removeEventListener('dragover', this.handlePreventDefault);
		container.removeEventListener('drop', this.handleDocumentDrop);
		container.removeEventListener('mouseleave', this.handleDragEnd);
	}

	handleDocumentDrop(event) {
		event.preventDefault();

		this.handleDragEnd();
	}

	handleDragEnd() {
		if (this.state.dragging) {
			this.setState({
				dragging: false,
				hoverOver: false
			});
		}
	}

	handleDragEnter(event) {
		const {types} = event.dataTransfer;

		if (types.indexOf(this.props.targetType) !== -1) {
			this.state.dragging = true;
		}
	}

	handleTargetDrop(event) {
		event.preventDefault();

		this.props.onDrop(event);

		this.handleDragEnd();
	}

	handleTargetEnter() {
		if (this.state.dragging) {
			this.state.hoverOver = true;
		}
	}

	handleTargetLeave() {
		if (this.state.dragging) {
			this.state.hoverOver = false;
		}
	}

	handlePreventDefault(event) {
		if (this.state.dragging) {
			event.preventDefault();
		}
	}

	render() {
		const {
			props: {children, dragMessage, hoverMessage},
			state: {dragging, hoverOver}
		} = this;

		return (
			<div
				class="drop-target-container"
				onDragEnter={this.handleTargetEnter}
				onDragLeave={this.handleTargetLeave}
				onDragOver={this.handlePreventDefault}
				onDrop={this.handleTargetDrop}
			>
				<Transition name="drop-zone-fade-in">
					{dragging && (
						<div class="drop-zone">
							{hoverOver ? hoverMessage : dragMessage}
						</div>
					)}
				</Transition>

				{children}
			</div>
		);
	}
}

DropTarget.PROPS = {
	container: Config.object().value(document),
	dragMessage: Config.any(),
	hoverMessage: Config.any(),
	onDrop: Config.func(),
	targetType: Config.oneOf(Object.values(DRAG_TYPES))
};

DropTarget.STATE = {
	dragging: Config.value(false),
	hoverOver: Config.value(false)
};

export default DropTarget;
