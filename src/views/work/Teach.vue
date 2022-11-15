<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="batchForm.id" clearable placeholder="请选择学期" @change="getTeach">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.bname"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="dialogVisible = true"
          v-if="hasAuth('work:teach:save')"
          >新增</el-button
        >
      </el-form-item>
      

      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button
            type="danger"
            slot="reference"
            :disabled="delBtlStatu"
            v-if="hasAuth('work:teach:delete')"
            >批量删除</el-button
          >
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column prop="id" label="编号"> </el-table-column>
      
      <el-table-column prop="collegeName" label="学院名称">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            type="success"
            v-for="collegeList in scope.row.collegeInfos"
            >{{ collegeList.name }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="tName" label="教师名称">
        <template slot-scope="scope">
          <el-tag size="medium" type="warning" v-for="user in scope.row.users">{{
            user.username
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="caName" label="班级名称">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            type="danger"
            v-for="classinfo in scope.row.classInfos"
            >{{ classinfo.name }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="cName" label="课程名称">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            type="info"
            v-for="course in scope.row.courseInfos"
            >{{ course.name }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="icon" width="260px" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row.id)"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="delHandle(scope.row.id)"
            >
              <el-button type="text" slot="reference"> 删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      :current-page="current"
      :page-size="size"
      :total="total"
    >
    </el-pagination>

    <!--新增对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="选择学期" prop="batchId" label-width="100px">
          <el-select v-model="editForm.batchId" clearable placeholder="请选择学期">
            <el-option
              v-for="item in batchs"
              :key="item.id"
              :label="item.bname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择学院" prop="collegeId" label-width="100px">
          <el-select v-model="editForm.collegeId" clearable placeholder="请选择学院">
            <el-option
              v-for="item in colleges"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择班级" prop="classId" label-width="100px">
          <el-select v-model="editForm.classId" clearable placeholder="请选择班级">
            <el-option
              v-for="item in classes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择教师" prop="teacherId" label-width="100px">
          <el-select v-model="editForm.teacherId" clearable placeholder="请选择教师">
            <el-option
              v-for="item in teachers"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择课程" prop="courseId" label-width="100px">
          <el-select v-model="editForm.courseId" clearable placeholder="请选择课程">
            <el-option
              v-for="item in courses"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
     <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVisible1"
      width="600px"
      :before-close="handleClose"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="课程名" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="发布者" prop="username" label-width="100px">
          <el-input
            v-model="userInfo.username"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>

        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  name: "Teach",
  data() {
    return {
      userInfo: {},
      batchForm: {},
      editForm: {},
      delBtlStatu: true,

      total: 0,
      size: 10,
      current: 1,

      tableData: [],

      multipleSelection: [],
      dialogVisible: false,
      dialogVisible1:false,
      
      options: [],
      batchs: [],
      classes: [],
      teachers: [],
      courses: [],
      colleges:[],
    };
  },
  created() {
    this.$axios.get("/work/batch/list").then((res) => {
      this.options = res.data.data.records;
    });

    this.$axios.get("/work/batch/list").then((res) => {
      this.batchs = res.data.data.records;
    });

    this.$axios.get("/work/class/list").then((res) => {
      this.classes = res.data.data.records;
    });

    this.$axios.get("/work/teacher/list").then((res) => {
      this.teachers = res.data.data.records;
    });

    this.$axios.get("/work/course/list").then((res) => {
      this.courses = res.data.data.records;
    });

    this.$axios.get("/work/college/list").then((res) => {
      this.colleges = res.data.data.records;
    });
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then((res) => {
        this.userInfo = res.data.data;
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log("勾选");
      console.log(val);
      this.multipleSelection = val;

      this.delBtlStatu = val.length == 0;
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.getTeach();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getTeach();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this.editForm = {};
    },
    handleClose() {
      this.resetForm("editForm");
    },

    getTeach() {
      this.$axios
        .get("/work/teach/list", {
          params: {
            current: this.current,
            size: this.size,
            batchId: this.batchForm.id,
          },
        })
        .then((res) => {
          this.tableData = res.data.data.records;
          this.size = res.data.data.size;
          this.current = res.data.data.current;
          this.total = res.data.data.total;
        });
      console.log(this.tableData);
    },

    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.$axios.post("/work/teach/save", this.addForm).then((res) => {
    //         this.$message({
    //           showClose: true,
    //           message: "恭喜你，操作成功",
    //           type: "success",
    //           onClose: () => {
    //             this.getTeach();
    //           },
    //         });

    //         this.dialogVisible = false;
    //       });
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },

    editHandle(id) {
      this.$axios.get("/work/teach/info/" + id).then((res) => {
        this.editForm = res.data.data;

        this.dialogVisible = true;
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/work/teach/" + (this.editForm.id ? "update" : "save"),
              this.editForm
            )
            .then((res) => {
              this.$message({
                showClose: true,
                message: "恭喜你，操作成功",
                type: "success",
                onClose: () => {
                  this.getTeach();
                },
              });

              this.dialogVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    delHandle(id) {
      var ids = [];

      if (id) {
        ids.push(id);
      } else {
        this.multipleSelection.forEach((row) => {
          ids.push(row.id);
        });
      }
      this.$axios.post("/work/teach/delete", ids).then((res) => {
        this.$message({
          showClose: true,
          message: "恭喜你，操作成功",
          type: "success",
          onClose: () => {
            this.getTeach();
          },
        });
      });
    },
  },
};
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>