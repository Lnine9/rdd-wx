// 数据格式,数据中只需要包含以下字段和数据格式,开发者可以添加字段,比如id等等,不影响组件显示,组件的返回结果是以菜单数组下标形式返回,如果传入数据中有value,也会返回value,开发者可根据返回的下标获取所选中的菜单
/*
[
	{
		"name":"",	//字符串类型 选填项 菜单名称,如不填,则取第一个子菜单的name值,filter类型则将设置为"筛选"
		"type":""	//字符串类型 必填项 可取值 hierarchy/filter  hierarchy单/多层级菜单(最多三级); filter筛选多选菜单
		"submenu":[	//对象数组类型 必填项 子菜单数据
			{
				"name":"",	//字符串类型 必填项 菜单名称
				"value":"",	//字符串类型 选填项 自定义内容,比如id等等,如果填写了,confirm返回的结果中将返回对应选中的value,若菜单无value字段则返回null,filter类型此字段无效果
				"submenu":[	//对象数组类型 必填项 子菜单数据
					{
						"name":"",	//字符串类型 必填项 菜单名称
						"value":"",	//字符串类型 选填项 自定义内容,比如id等等,如果填写了,confirm返回的结果中将返回对应选中的value,若菜单无value字段则返回null
						"submenu":[	//对象数组类型 必填项 子菜单数据 filter类型无效 
							{
								"name":"",	//字符串类型 必填项 菜单名称 hierarchy类型层级最多到此
								"value":"",	//字符串类型 选填项 自定义内容,比如id等等,如果填写了,confirm返回的结果中将返回对应选中的value,若菜单无value字段则返回null
							}
						]
					}
				]
			}
		]
	}
]
*/

//0.0.4版本起 返回结果将有两部分组成:
/*
{
	index:[],	//旧版本的下标数组形式
	value:[]	//菜单中的valve,结构和下标结果数组一样,只是把下标替换成了value而已
}
*/
///以下演示数据中,我故意把value设置成name,只是为了方便演示,使示例更加易懂,实际使用时候value应该是一个标识,给后台识别所用的.
export default [{
		name:'全城',
		"type": 'hierarchy',
		"submenu": [{
				"name": "重庆市",
				"value": "重庆市"
			},
		]
	},
	{
		// name:'智能排序',
		"type": 'hierarchy',
		"submenu": [{
				"name": "默认排序",
				"value": 0
			},
			{
				"name": "离我最近",
				"value": 1
			},
			{
				"name": "价格升序",
				"value": 2
			},
			{
				"name": "价格降序",
				"value": 1
			}
		]
	},
	{
		"name":'销量',
		"type": 'hierarchy',
		"submenu": [
			{
				"name":"默认",
				"value":0
			},
			{
				"name":"从低到高",
				"value":2
			},
			{
				"name":"从高到低",
				"value":1
			}
		]
	}
]

