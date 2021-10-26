
import React, { useEffect, useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { SortableHandle, } from 'react-sortable-hoc';
import {MyIcon} from "@/components/MyIcon"
export const DragHandle = SortableHandle(() => <MyIcon type="icon-yidongdefuben" />);