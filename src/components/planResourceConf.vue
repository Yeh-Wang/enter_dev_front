<template>
  <div>
    <el-row>
      <el-col :span="2">
        <el-button type="primary" @click="backCode">back</el-button>
      </el-col>
      <el-col :span="4"/>
      <el-col :span="12">
        <el-button size="default" @click="one_url">更新计划基本信息</el-button>
        <el-divider direction="vertical"/>
        <el-button size="default" @click="two_url">该培训计划资源</el-button>
        <el-divider direction="vertical"/>
        <el-button size="default" @click="three_url">配置试题资源</el-button>
        <el-divider direction="vertical"/>
        <el-button size="default" @click="four_url">配置视频资源</el-button>
      </el-col>
    </el-row>
  </div>


  <!--  预览视频窗口-->
  <el-dialog v-model="videoDialog" :title="nowVideoName" @close="closeVideoDialog" align-center>
    <vue3VideoPlay
        v-bind="videoOptions"
    />
  </el-dialog>
  <!--  试题资源预览-->
  <el-dialog v-model="chooseDetail" align-center>
    <el-card v-model="chooseView" style="height: 100%;width: 100%">
      <el-row>
        <el-col :span="24">
          {{ chooseView.id }}.({{ chooseView.type }}) {{ chooseView.question }} ({{ chooseView.score }}分)
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p>A:{{ chooseView.answerA }}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p>B:{{ chooseView.answerB }}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p>C:{{ chooseView.answerC }}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p>D:{{ chooseView.answerD }}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p style="border-top: 1px solid #efecec;font-size: small; word-wrap: break-word">
            正确答案:{{ chooseView.answerCorrect }}。解析:{{ chooseView.analysis }}
          </p>
        </el-col>
      </el-row>
    </el-card>
  </el-dialog>
  <el-dialog v-model="judgeDetail" align-center>
    <el-card v-model="judgeView" style="height: 100%;width: 100%">
      <el-row>
        <el-col :span="24">
          {{ judgeView.id }}.({{ judgeView.type }}) {{ judgeView.question }} ({{ judgeView.score }}分)
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p style="border-top: 1px solid #efecec;font-size: small; word-wrap: break-word">
            正确答案:{{ judgeView.answerCorrect }}。解析:{{ judgeView.analysis }}
          </p>
        </el-col>
      </el-row>
    </el-card>
  </el-dialog>
  <!--    视频删除确认框-->
  <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
  >
    <span>Are you sure?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deleteMakeSure">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--    选择题删除确认框-->
  <el-dialog
      v-model="chooseDialogVisible"
      title="Tips"
      width="30%"
  >
    <span>Are you sure?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="chooseDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deleteChooseMakeSure">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--    判断题删除确认框-->
  <el-dialog
      v-model="judgeDialogVisible"
      title="Tips"
      width="30%"
  >
    <span>Are you sure?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="judgeDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deleteJudgeMakeSure">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <div>
    <!--    更新计划基本信息-->
    <el-form v-show="show_1" :model="updateForm" label-width="120px">
      <el-form-item label="计划描述">
        <el-input v-model="updateForm.trainIntroduce"/>
      </el-form-item>
      <el-form-item label="计划类型">
        <el-input v-model="updateForm.trainType"/>
      </el-form-item>
      <el-form-item label="计划周期（周）">
        <el-select-v2
            v-model="updateForm.trainPeriod"
            placeholder="计划周期"
            :options="options"
        />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-col :span="15">
          <el-date-picker
              v-model="updateForm.startTime"
              type="datetime"
              placeholder="Pick a date"
              style="width: 100%"
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-col :span="15">
          <el-date-picker
              v-model="updateForm.endTime"
              type="datetime"
              placeholder="Pick a date"
              style="width: 100%"
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitUpdate">Submit</el-button>
      </el-form-item>
    </el-form>

    <!--      该培训计划资源-->
    <el-row>
      <el-col :span="24">
        <el-table v-show="show_2" :data="allVideoInfo" height="295" stripe
                  :cell-style="{border:'1px solid var(--el-border-color)'}"
                  style="width: 100%;border-bottom: 2px solid #ccc6c6">
          <el-table-column label="资源编号" prop="id"/>
          <el-table-column label="名称" prop="videoName"/>
          <el-table-column label="资源类型" prop="videoType"/>
          <el-table-column label="视频资源总时长" prop="videoTotalTime"/>
          <el-table-column align="right">
            <template #default="scope">
              <el-button size="small" @click="videoShow(scope.$index, scope.row)"
              >预览
              </el-button
              >
              <el-button
                  size="small"
                  type="danger"
                  @click="videoDelete(scope.$index, scope.row)"
              >Delete
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-table v-show="show_2" :data="filterChooseData" height="310" stripe
                  :cell-style="{border:'1px solid var(--el-border-color)'}"
                  style="width: 100%;border-right: 1px solid #b6b0b0">
          <el-table-column label="试题编号" prop="id"/>
          <el-table-column label="试题类型" prop="type"/>
          <el-table-column label="试题内容" prop="question"/>
          <el-table-column align="right">
            <template #header>
              <el-input v-model="searchChoose" size="small" placeholder="Type to search"/>
            </template>
            <template #default="scope">
              <el-button
                  circle
                  size="small"
                  type="primary"
                  icon="More"
                  @click="chooseDetails(scope.$index, scope.row)"/>
              <el-button
                  circle
                  size="small"
                  type="danger"
                  icon="Close"
                  @click="chooseDelete(scope.$index, scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table v-show="show_2" :data="filterJudgeData" height="310" stripe
                  :cell-style="{border:'1px solid var(--el-border-color)'}"
                  style="width: 100%;">
          <el-table-column label="试题编号" prop="id"/>
          <el-table-column label="试题类型" prop="type"/>
          <el-table-column label="试题内容" prop="question"/>
          <el-table-column align="right">
            <template #header>
              <el-input v-model="searchJudge" size="small" placeholder="Type to search"/>
            </template>
            <template #default="scope">
              <el-button
                  circle
                  size="small"
                  type="primary"
                  icon="More"
                  @click="judgeDetails(scope.$index, scope.row)"/>
              <el-button
                  circle
                  size="small"
                  type="danger"
                  icon="Close"
                  @click="judgeDelete(scope.$index, scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!--    配置试题资源-->
    <el-row>
      <el-col :span="12">
        <el-table v-show="show_3" :data="filterTableData" height="310" stripe
                  :cell-style="{border:'1px solid var(--el-border-color)'}"
                  style="width: 100%;border-right: 1px solid #b6b0b0">
          <el-table-column label="试题编号" prop="userId"/>
          <el-table-column label="试题类型" prop="realName"/>
          <el-table-column label="试题内容" prop="userName"/>
          <el-table-column align="right">
            <template #header>
              <el-input v-model="search" size="small" placeholder="Type to search"/>
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >details
              </el-button
              >
              <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
              >Delete
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table v-show="show_3" :data="filterTableData" height="310" stripe
                  :cell-style="{border:'1px solid var(--el-border-color)'}"
                  style="width: 100%;">
          <el-table-column label="试题编号" prop="userId"/>
          <el-table-column label="试题类型" prop="realName"/>
          <el-table-column label="试题内容" prop="userName"/>
          <el-table-column align="right">
            <template #header>
              <el-input v-model="search" size="small" placeholder="Type to search"/>
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >details
              </el-button
              >
              <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
              >Delete
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--    配置视频资源-->
    <el-row>
      <el-col :span="24">
        <el-table v-show="show_4" :data="allVideoInfo" height="295" stripe
                  :cell-style="{border:'1px solid var(--el-border-color)'}"
                  style="width: 100%;border-bottom: 2px solid #ccc6c6">
          <el-table-column label="资源编号" prop="userId"/>
          <el-table-column label="名称" prop="realName"/>
          <el-table-column label="资源类型" prop="userName"/>
          <el-table-column label="视频资源总时长" prop="userPwd"/>
          <el-table-column align="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >预览
              </el-button
              >
              <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
              >Delete
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";
import axios from "axios";
import * as events from "events";
import {ElMessage} from "element-plus";

const backCode = () => {
  router.go(-1)
}

const plan_id = ref(); //接收路由参数（要管理的计划编号）
const route = useRoute()
const show_1 = ref(false)
const show_2 = ref(true)
const show_3 = ref(false)
const show_4 = ref(false)

interface trainInfo {
  id: number,
  founder: number,
  mechanismId: number,
  trainIntroduce: string,
  trainType: string,
  trainPeriod: number,
  startTime: string,
  endTime: string,
  trainStatus: boolean
}

interface videoInfo {
  id: number;
  founder: number;
  videoName: string;
  videoType: string;
  videoUrl: string;
  videoTotalTime: string;
}

interface chooseInfo {
  id: number;
  founder: number;
  type: string;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  answerCorrect: string;
  analysis: string;
  score: number
}

interface judgeInfo {
  id: number;
  founder: number;
  type: string;
  question: string;
  answerCorrect: string;
  analysis: string;
  score: number
}

//------------------------------------------------------------------------------------------------------<!--   视频预览-->
const nowVideoName = ref("")
const videoDialog = ref(false)
const videoOptions = reactive({
  width: "100%", //播放器宽度
  height: "100%", //播放器高度
  color: "#409eff", //主题色
  title: "", //视频名称
  src: "",//视频源
  muted: false, //静音
  webFullScreen: false,
  speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
  autoPlay: false, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制
  currentTime: 0,
  controlBtns: [
    "audioTrack",
    "quality",
    "speedRate",
    "volume",
    "setting",
    "pip",
    "pageFullScreen",
    "fullScreen",
  ], //显示所有按钮,
})
const closeVideoDialog = () => {
  videoOptions.currentTime = 0
}

//------------------------------------------------------------------------------------------------------本机构培训计划资源对应的表格的数据
const allVideoInfo: videoInfo[] = reactive([])
const allChooseInfo: chooseInfo[] = reactive([])
const allJudgeInfo: judgeInfo[] = reactive([])

//------------------------------------------------------------------------------------------------------修改培训计划信息
let updateForm: trainInfo = {
  id: 1,
  founder: 1,
  mechanismId: 1,
  trainIntroduce: "",
  trainType: "",
  trainPeriod: 4,
  startTime: "2000-02-02 00:00:00",
  endTime: "2000-02-02 00:00:00",
  trainStatus: false
}
const options = Array.from({length: 100}).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))
const onSubmitUpdate = () => {

}
const one_url = () => {
  show_1.value = true;
  show_2.value = false;
  show_3.value = false;
  show_4.value = false
  // axios.get(""+plan_id.value).then(res=>{
  //   updateForm=res.data
  // })
}
//------------------------------------------------------------------------------------------------------该培训计划资源管理
const two_url = () => {
  show_2.value = true;
  show_1.value = false;
  show_3.value = false;
  show_4.value = false
  axios.get("http://localhost:9090/training-resource-entity/getVideoByPlanId/" + plan_id.value).then(res => {
    allVideoInfo.splice(0, allVideoInfo.length)
    allVideoInfo.push(...res.data)
  })
  axios.get("http://localhost:9090/training-resource-entity/getChooseByPlanId/" + plan_id.value).then(res => {
    allChooseInfo.splice(0, allChooseInfo.length)
    allChooseInfo.push(...res.data)
  })
  axios.get("http://localhost:9090/training-resource-entity/getJudgeByPlanId/" + plan_id.value).then(res => {
    allJudgeInfo.splice(0, allJudgeInfo.length)
    allJudgeInfo.push(...res.data)
  })
}
//视频
const videoShow = (index: number, videoInfo: videoInfo) => {  //视频预览按钮
  videoOptions.title = videoInfo.videoName
  videoOptions.src = videoInfo.videoUrl
  nowVideoName.value = videoInfo.videoName
  videoDialog.value = true
}
const dialogVisible = ref(false)
const videoDelete = (index: number, videoInfo: videoInfo) => {
  dialogVisible.value = true
  deleteVideoId.value = videoInfo.id
}
const deleteVideoId = ref(999)
const deleteMakeSure = () => {
  axios.get("http://localhost:9090/training-resource-entity/deleteOneByPlanId/" + plan_id.value + "," + deleteVideoId.value + "," + 3).then(res => {
    // if (res.data === 1) {
    ElMessage({
      message: '删除成功！',
      type: 'success'
    })
    dialogVisible.value = false
    let deleteIndex_1 = allVideoInfo.findIndex((videoInfo) => {
      return videoInfo.id === deleteVideoId.value
    })
    allVideoInfo.splice(deleteIndex_1, 1)
    // } else {
    //   ElMessage.error("删除失败，请重新删除")
    //   dialogVisible.value = false
    // }
  })
}
//选择试题
const chooseView: chooseInfo = reactive({
  id: 1,
  founder: 1,
  type: "",
  question: "",
  answerA: "",
  answerB: "",
  answerC: "",
  answerD: "",
  answerCorrect: "",
  analysis: "",
  score: 1
})
const chooseDetail = ref(false)
const chooseDetails = (index: number, chooseEntity: chooseInfo) => {
  chooseView.id = chooseEntity.id;
  chooseView.question = chooseEntity.question;
  chooseView.score = chooseEntity.score;
  chooseView.answerA = chooseEntity.answerA;
  chooseView.answerB = chooseEntity.answerB;
  chooseView.answerC = chooseEntity.answerC;
  chooseView.answerD = chooseEntity.answerD;
  chooseView.answerCorrect = chooseEntity.answerCorrect;
  chooseView.analysis = chooseEntity.analysis;
  chooseView.type = chooseEntity.type
  chooseDetail.value = true
}
const chooseDelete = (index: number, chooseEntity: chooseInfo) => {
  chooseDialogVisible.value = true;
  deleteChooseId.value = chooseEntity.id
}
const searchChoose = ref('')
const filterChooseData = computed(() =>
    allChooseInfo.filter(
        (data) =>
            !searchChoose.value ||
            data.type.toLowerCase().includes(searchChoose.value.toLowerCase())
    )
)
const chooseDialogVisible = ref(false)
const deleteChooseId = ref(999)
const deleteChooseMakeSure = () => {
  axios.get("http://localhost:9090/training-resource-entity/deleteOneByPlanId/" + plan_id.value + "," + deleteChooseId.value + "," + 1).then(res => {
    // if (res.data === 1) {
    ElMessage({
      message: '删除成功！',
      type: 'success'
    })
    chooseDialogVisible.value = false
    let deleteIndex_2 = allChooseInfo.findIndex((chooseInfo) => {
      return chooseInfo.id === deleteChooseId.value
    })
    allChooseInfo.splice(deleteIndex_2, 1)
    // } else {
    //   ElMessage.error("删除失败，请重新删除")
    //   chooseDialogVisible.value = false
    // }
  })
}

//判断试题
const judgeView: judgeInfo = reactive({
  id: 1,
  founder: 1,
  type: "",
  question: "",
  answerCorrect: "",
  analysis: "",
  score: 2
})
const judgeDetail = ref(false)
const judgeDetails = (index: number, judgeEntity: judgeInfo) => {
  judgeView.id = judgeEntity.id;
  judgeView.type = judgeEntity.type;
  judgeView.question = judgeEntity.question;
  judgeView.score = judgeEntity.score;
  judgeView.answerCorrect = judgeEntity.answerCorrect;
  judgeView.analysis = judgeEntity.analysis;
  judgeDetail.value = true
}
const judgeDelete = (index: number, judgeEntity: judgeInfo) => {
  judgeDialogVisible.value = true;
  deleteJudgeId.value = judgeEntity.id
}
const searchJudge = ref('')
const filterJudgeData = computed(() =>
    allJudgeInfo.filter(
        (data) =>
            !searchJudge.value ||
            data.type.toLowerCase().includes(searchJudge.value.toLowerCase())
    )
)
const judgeDialogVisible = ref(false)
const deleteJudgeId = ref(999)
const deleteJudgeMakeSure = () => {
  axios.get("http://localhost:9090/training-resource-entity/deleteOneByPlanId/" + plan_id.value + "," + deleteJudgeId.value + "," + 2).then(res => {
    // if (res.data === 1) {
    ElMessage({
      message: '删除成功！',
      type: 'success'
    })
    judgeDialogVisible.value = false
    let deleteIndex_3 = allJudgeInfo.findIndex((judgeInfo) => {
      return judgeInfo.id === deleteJudgeId.value
    })
    allJudgeInfo.splice(deleteIndex_3, 1)
    // } else {
    //   ElMessage.error("删除失败，请重新删除")
    //   judgeDialogVisible.value = false
    // }
  })
}

//------------------------------------------------------------------------------------------------------该培训计划试题资源配置
const three_url = () => {
  show_1.value = false;
  show_2.value = false;
  show_3.value = true;
  show_4.value = false
}
//------------------------------------------------------------------------------------------------------该培训计划视频资源配置
const four_url = () => {
  show_1.value = false;
  show_2.value = false;
  show_3.value = false;
  show_4.value = true
}

onMounted(() => {
  plan_id.value = route.params.id
  axios.get("http://localhost:9090/training-resource-entity/getVideoByPlanId/" + plan_id.value).then(res => {
    allVideoInfo.splice(0, allVideoInfo.length)
    allVideoInfo.push(...res.data)
  })
  axios.get("http://localhost:9090/training-resource-entity/getChooseByPlanId/" + plan_id.value).then(res => {
    allChooseInfo.splice(0, allChooseInfo.length)
    allChooseInfo.push(...res.data)
  })
  axios.get("http://localhost:9090/training-resource-entity/getJudgeByPlanId/" + plan_id.value).then(res => {
    allJudgeInfo.splice(0, allJudgeInfo.length)
    allJudgeInfo.push(...res.data)
  })
})
</script>

<style scoped>
.el-button {
  font-family: 楷体, serif;
  font-size: medium;
}
</style>