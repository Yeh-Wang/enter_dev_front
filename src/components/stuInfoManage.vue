<template>
  <el-row>
    <el-col :span="21"/>
    <el-col :span="3">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="Add a user"
          placement="top"
      >
        <el-button type="primary" size="default" circle icon="Plus" @click="addUser"/>
      </el-tooltip>
      <el-tooltip
          class="box-item"
          effect="dark"
          content="export all users Info"
          placement="top"
      >
        <el-button type="primary" size="default" @click="exportUsersInfo" circle icon="TopRight"/>
      </el-tooltip>
      <el-tooltip
          class="box-item"
          effect="dark"
          content="import Info from excel"
          placement="top"
      >
        <el-button type="primary" size="default" @click="importUsersInfo" circle icon="BottomLeft"/>
      </el-tooltip>
    </el-col>
  </el-row>
  <!--    Update a user Information-->
  <el-dialog
      v-model="centerUpdateDialogVisible"
      title="Update a user Information"
      width="30%"
      align-center
  >
    <el-form :model="updateForm" label-width="120px">
      <el-form-item label="姓名">
        <el-input v-model="updateForm.realName"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="updateForm.userSexy" placeholder="please select your zone">
          <el-option label="man" value="man"/>
          <el-option label="woman" value="woman"/>
          <el-option label="other" value="other"/>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-select-v2
            v-model="updateForm.userAge"
            placeholder="年龄"
            :options="options"
        />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="updateForm.userName"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="updateForm.userPwd"/>
      </el-form-item>
      <el-form-item label="Mobile Phone">
        <el-input maxlength="11" show-word-limit v-model="updateForm.userPhone"/>
      </el-form-item>
      <el-form-item label="Address">
        <el-input v-model="updateForm.userAddress"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitUpdate">Submit</el-button>
        <el-button @click="updateClose">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--    删除确认框-->
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
  <!--    add a user Information-->
  <el-dialog
      v-model="centerAddDialogVisible"
      title="Add a User Information"
      width="30%"
      align-center
  >
    <el-form :model="addForm" label-width="120px">
      <el-form-item label="姓名">
        <el-input v-model="addForm.realName"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="addForm.userSexy" placeholder="please select your zone">
          <el-option label="man" value="man"/>
          <el-option label="woman" value="woman"/>
          <el-option label="other" value="other"/>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-select-v2
            v-model="addForm.userAge"
            placeholder="年龄"
            :options="options"
        />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="addForm.userName"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="addForm.userPwd"/>
      </el-form-item>
      <el-form-item label="Mobile Phone">
        <el-input maxlength="11" show-word-limit v-model="addForm.userPhone"/>
      </el-form-item>
      <el-form-item label="Address">
        <el-input v-model="addForm.userAddress"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitAdd">Submit</el-button>
        <el-button @click="addClose">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>


  <el-table :data="filterTableData" height="550" stripe :cell-style="{border:'1px solid var(--el-border-color)'}"
            style="width: 100%">
    <el-table-column label="用户编号" prop="userId"/>
    <el-table-column label="姓名" prop="realName"/>
    <el-table-column label="用户名" prop="userName"/>
    <el-table-column label="密码" prop="userPwd"/>
    <el-table-column label="性别" prop="userSexy"/>
    <el-table-column label="年龄" prop="userAge"/>
    <el-table-column label="联系电话" prop="userPhone"/>
    <el-table-column label="住址" prop="userAddress"/>
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search"/>
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
        >Edit
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
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";
import {ExcelService} from "@/exportToExcel"

//导出数据
const exportUsersInfo = () => {
  const titleArr = ['用户编号', '用户等级', '所属机构', '姓名', '用户名', '密码', '性别', '年龄', '联系电话', '地址']//表头中文名
  const s = new ExcelService();
  s.exportAsExcelFile(allUserInfo, "test", titleArr, "sheetName")
}
//导入数据
const importUsersInfo = () =>{
  ElMessage({
    message:"I can't complete it!",
    type:"error"
  })
}


interface usersInfo {
  userId: number;
  userGrade: number;
  userMechanism: number;
  realName: string;
  userName: string;
  userPwd: string;
  userSexy: string;
  userAge: string;
  userPhone: string;
  userAddress: string;
}

const options = Array.from({length: 100}).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))

const mechanism_id = ref(); //接收路由参数（登录用户所属的机构编号）
const route = useRoute();
const allUserInfo: usersInfo[] = reactive([])
//add a user information
const centerAddDialogVisible = ref(false)
const addForm: usersInfo = reactive({
  userId: 1,
  userGrade: 1,
  userMechanism: 1,
  realName: "",
  userName: "",
  userPwd: "",
  userSexy: "",
  userAge: "",
  userPhone: "",
  userAddress: ""
})
const addUser = () => {
  centerAddDialogVisible.value = true
  addForm.realName = '';
  addForm.userAddress = '';
  addForm.userName = '';
  addForm.userPwd = '';
  addForm.userPhone = '';
  addForm.userAge = '';
  addForm.userSexy = ''
}
const onSubmitAdd = () => {
  if (addForm.userName === "" || addForm.userPwd === "") {
    ElMessage.error("请输入用户名和密码！")
  } else {
    addForm.userGrade = 2;
    addForm.userMechanism = mechanism_id.value
    axios.post("http://localhost:9090/users-info-entity/addUserInfo", addForm).then(res => {
      ElMessage({
        message: '添加成功！',
        type: 'success'
      })
      addForm.userId = res.data
      centerAddDialogVisible.value = false
      axios.get("http://localhost:9090/users-info-entity/getUsersInfoByOrgId/" + mechanism_id.value + ',' + 2).then(res => {
        allUserInfo.splice(0, allUserInfo.length)
        allUserInfo.push(...res.data)
      })
    })
  }
}
const addClose = () => {
  centerAddDialogVisible.value = false
  addForm.realName = '';
  addForm.userAddress = '';
  addForm.userName = '';
  addForm.userPwd = '';
  addForm.userPhone = '';
  addForm.userAge = '';
  addForm.userSexy = ''
}
//delete a user information
const dialogVisible = ref(false)
const deleteId = ref(999)
const handleDelete = (index: number, row: usersInfo) => {
  deleteId.value = row.userId
  dialogVisible.value = true
}
const deleteMakeSure = () => {
  let deleteIndex = allUserInfo.findIndex((user) => {
    return user.userId === deleteId.value
  })
  allUserInfo.splice(deleteIndex, 1)
  axios.get("http://localhost:9090/users-info-entity/deleteUserInfo/" + deleteId.value).then(res => {
    if (res.data === 1) {
      ElMessage({
        message: '删除成功！',
        type: 'success'
      })
      dialogVisible.value = false
    } else {
      ElMessage.error("删除失败，请重新删除")
      dialogVisible.value = false
    }
  })
}
//update a user information
const centerUpdateDialogVisible = ref(false)
let updateForm: usersInfo = {
  userId: 1,
  userGrade: 1,
  userMechanism: 1,
  realName: "",
  userName: "",
  userPwd: "",
  userSexy: "",
  userAge: "",
  userPhone: "",
  userAddress: ""
}
const handleEdit = (index: number, row: usersInfo) => {
  updateForm = row
  centerUpdateDialogVisible.value = true
}
const onSubmitUpdate = () => {
  // let indexNow = allUserInfo.findIndex(user => user.userId===updateForm.userId)
  // allUserInfo[indexNow].realName=updateForm.realName;allUserInfo[indexNow].userSexy=updateForm.userSexy;allUserInfo[indexNow].userAge=updateForm.userAge;allUserInfo[indexNow].userName=updateForm.userName;
  // allUserInfo[indexNow].userPwd=updateForm.userPwd;allUserInfo[indexNow].userPhone=updateForm.userPhone;allUserInfo[indexNow].userAddress=updateForm.userAddress
  axios.post("http://localhost:9090/users-info-entity/updateUserInfo", updateForm).then(res => {
    if (res.data === 1) {
      ElMessage({
        message: '更新成功！',
        type: 'success'
      })
      centerUpdateDialogVisible.value = false
    } else {
      ElMessage.error("更新失败，请重新更新")
      centerUpdateDialogVisible.value = false
    }
  })
}
const updateClose = () => {
  centerUpdateDialogVisible.value = false
}
// search user by real name
const search = ref('')
const filterTableData = computed(() =>
    allUserInfo.filter(
        (data) =>
            !search.value ||
            data.realName.toLowerCase().includes(search.value.toLowerCase())
    )
)

onMounted(() => {
  mechanism_id.value = route.params.id
  axios.get("http://localhost:9090/users-info-entity/getUsersInfoByOrgId/" + mechanism_id.value + ',' + 2).then(res => {
    allUserInfo.push(...res.data)
  })
})
</script>

<style scoped>
</style>