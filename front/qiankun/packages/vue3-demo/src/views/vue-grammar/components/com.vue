<template>
  <RenderTableColumn />
</template>

<script setup lang="tsx" name="TableColumn">
import { ref, reactive, useSlots, useAttrs } from 'vue'
const slots = useSlots()
const attrs = useAttrs()
const data = ref({ a: 1 })
console.log('slots', slots)
console.log('attrs', attrs)

const RenderTableColumn = () => {
  return (
    <>
      <div>{slots.default(data)}</div>
      <div>这是属性的attr值:{attrs.attr}</div>
    </>
  )
}
</script>
<!-- const RenderTableColumn = (item: ColumnProps) => {
	return (
		<>
			{item.isShow && (
				<el-table-column
					{...item}
					align={item.align ?? "left"}
					showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
				>
					{{
						default: (scope: RenderScope<any>) => {
							if (item._children) return item._children.map(child => RenderTableColumn(child));
							if (item.render) return item.render(scope);
							if (slots[handleProp(item.prop!)]) return slots[handleProp(item.prop!)]!(scope);
							if (item.tag) return <el-tag type={getTagType(item, scope)}>{renderCellData(item, scope)}</el-tag>;
							return renderCellData(item, scope);
						},
						header: (scope: HeaderRenderScope<any>) => {
							if (item.headerRender) return item.headerRender(scope);
							if (slots[`${handleProp(item.prop!)}Header`]) return slots[`${handleProp(item.prop!)}Header`]!(scope);
							return item.label?item.label:"--";
						}
					}}
				</el-table-column>
			)}
		</>
	);
}; -->
