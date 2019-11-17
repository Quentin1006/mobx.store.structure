import React from 'react';
import { storiesOf } from '@storybook/react';

import { FileActionsApp } from "./scenarios/file-actions"
import { VisualizeActionApp } from "./scenarios/vizualize-action"
import { EditActionApp } from "./scenarios/edit-action"
import { DownloadActionApp } from "./scenarios/download-action"
import { UploadControllerApp } from "./scenarios/upload-controller"
import { pdf } from "./data"
import './stories.css'

storiesOf('DownloadAction', module)
	.add('for a pdf', () => <DownloadActionApp/>)
	.add('for a jpeg', () => {})

storiesOf('EditAction', module)
	.add('classic', () => <EditActionApp/>)

storiesOf('VisualizeAction', module)
	.add('classic', () => <VisualizeActionApp/>)

storiesOf('FileActions', module)
	.add('with cutomized edit handler', () => <FileActionsApp/>)

storiesOf('UploadController', module)
	.add('without initial file', () => <UploadControllerApp/>)
	.add('with initial file', () => (
		<UploadControllerApp 
			initialFile={{name:"my-file-which-is-very-very-long.pdf"}}
			initialContentAndType={{
				content: pdf,
				contentType: "application/pdf"
			}}
		/>
	))



