import React, { useEffect, useState,forwardRef ,useImperativeHandle} from 'react';
import styles from "./index.less"
import { analysisMethodsEnum, analysisMethodsQtypeEnum } from "./const.d"
import { Checkbox, Empty } from 'antd';
import { formatEnumToOptions } from "@/utils/utils"
import AnalysisMethod from './analysisMethod'
import CreateModal from "@/components/CreateModal"
import TransferCheckbox from "@/components/TransferCheckbox"
interface AnalysisMethodsProps {
  question: Array<any>,
  rules: any,
  changeRules: (value: object) => void,
  analysisRef:any,
}
const analysisMethods = formatEnumToOptions(analysisMethodsEnum)

/* 添加分析方法  */
const AnalysisMethods: React.FC<AnalysisMethodsProps> =(props) => {
  const { question, rules, changeRules,analysisRef } = props
  console.log(props)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [methods, setMethods] = useState<Array<string>>([])
  const [questionList, setQuestionList] = useState<any>([])
  const [questionLists, setQuestionLists] = useState<any>([])
  const [checkedLists, setCheckedLists] = useState<any>([]) //选中的题
  const [allDisabled,setAllDisabled] = useState<boolean>(false)
  // const [rules, seRules] = useState<any>([])
  const [position, setPosition] = useState<string>('')

  useEffect(() => {
    let rules_methods: any = []
    analysisMethods.forEach((item: any) => {
      if (rules[item.value] == null) {

      } else {
        rules_methods.push(item.value)
      }

    })
    setMethods(rules_methods)
  }, [])
  const modalHandOk = () => {
    let newcheckedLists: any = JSON.parse(JSON.stringify(checkedLists))
    if (position === "meanRule") {
      newcheckedLists.forEach((question: any) => {
        question['optionList'].forEach((option: any, optionIndex: number) => {
          option['weight'] = optionIndex + 1
          // option['weightCode'] = optionIndex + 1
        })
      })
    }
    if (rules[position]) {
      rules[position].push(...newcheckedLists)
    } else {
      rules[position] = newcheckedLists
    }

    changeRules({ ...rules })
    setModalVisible(false)
    setCheckedLists([])
  }
  useImperativeHandle(analysisRef, () => ({
    emptyRules: () => {
      console.log(analysisRef)
      setMethods([])
    }
  }));
  return (
    <div className={styles.analysisMethods}>
      <div style={{ margin: "0 0 30px 0" }}>
        请选择分析方法：<Checkbox.Group value={methods} options={analysisMethods} onChange={(value: any) => {
          setMethods([...value])
          let newRules: any = JSON.parse(JSON.stringify(rules))
          analysisMethods.forEach((item: any) => {
            if (value.includes(item.value)) {
              if (rules[item.value] == null) {
                newRules[item.value] = []
              }
            } else {
              newRules[item.value] = null
            }
          })
          changeRules(newRules)
        }} />
      </div>


      {methods.length === 0 ?
        <div className={styles.content}>
          <Empty image={require("@/assets/analysilEmpty@2x.png")} description={<div style={{ color: "rgba(144,147,153,1)" }}>请选择您要使用的分析方法</div>}></Empty>
        </div>
        :
        methods.map((method: any, index: number) => {
          return <div key={method}>
            <AnalysisMethod
              method={method}
              rule={rules[method]}
              editQuestion={
                (ruleIndex: number, method: string, optionList: any) => {
                  console.log(optionList)
                  rules[method][ruleIndex]['optionList'] = [...optionList]
                  changeRules({ ...rules })
                }
              }
              delMethods={(method: string) => {
                setMethods(methods.filter((item: string) => item != method))
                rules[method] = null
                changeRules({ ...rules })
              }}
              delQuestion={(ruleIndex: number, method: string) => {
                rules[method].splice(ruleIndex, 1)
                changeRules({ ...rules })
              }}
              addQuestion={() => {
                setModalVisible(true)
                setPosition(method)
                const newQuestion: any = JSON.parse(JSON.stringify(question))
                setQuestionList(JSON.parse(JSON.stringify(question)))
                let disabledNum = 0
               
                newQuestion.forEach((questionItem: any, questionIndex: number) => {
                  questionItem.disabled = false
                  rules[method].forEach((ruleQuestion: any) => {
                    if (questionItem.value == ruleQuestion.value) {
                      questionItem.disabled = true
                      disabledNum+=1
                    }
                  })
                })
                
                if (method === 'npsRule') {
                  let newQuestions:any = newQuestion.filter((item: any) => (analysisMethodsQtypeEnum[method]['type'].includes(item.questionType) && item['optionList'].length === analysisMethodsQtypeEnum[method]['length']))
                  setQuestionLists(newQuestions)
                  setAllDisabled(disabledNum===newQuestions.length)
                }else if(method === "meanRule"){
                  setQuestionLists([...newQuestion])
                  setAllDisabled(disabledNum===newQuestion.length)
                } else if(analysisMethodsQtypeEnum[method]['length']){
                  let newQuestions:any =newQuestion.filter((item: any) => (analysisMethodsQtypeEnum[method]['type'].includes(item.questionType) && item['optionList'].length >= analysisMethodsQtypeEnum[method]['length']))
                  setQuestionLists(newQuestions)
                  setAllDisabled(disabledNum===newQuestions.length)
                }else{
                  let newQuestions:any =newQuestion.filter((item: any) => (analysisMethodsQtypeEnum[method]['type'].includes(item.questionType)))
                  setQuestionLists(newQuestions)
                  setAllDisabled(disabledNum===newQuestions.length)
                }
              }}
            />
          </div>
        })

      }
      <CreateModal width={600} onCancel={() => {
        setModalVisible(false)
      }}
        onHandleOk={() => {
          modalHandOk()
        }}
        title='请选择题目' submitText="确定" modalVisible={modalVisible}>
        <TransferCheckbox
          isShowCheckedAll={true}
          isChecked={false}
          isCheckedAll={allDisabled}
          plainOptions={questionList}
          optionsList={questionLists}
          changeData={(list: any) => {
            setQuestionLists(list)
          }}
          checkedListChange={
            (value: any) => {
              setCheckedLists(JSON.parse(JSON.stringify(value)))
            }
          }
        />
      </CreateModal>
    </div>
  );
}

export default AnalysisMethods;
