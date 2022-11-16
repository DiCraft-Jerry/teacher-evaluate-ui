<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="课程名" clearable>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getCourseList">搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="dialogVisible = true"
          v-if="hasAuth('work:course:save')"
          >新增</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button
            type="danger"
            slot="reference"
            :disabled="delBtlStatu"
            v-if="hasAuth('work:course:delete')"
            >批量删除<i class="el-icon-remove-outline"></i
          ></el-button>
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

      <el-table-column prop="bname" label="批次名称">
        <template slot-scope="scope">
          <el-tag size="small" type="warning" v-for="item in scope.row.batches">{{
            item.bname
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="课程名称" width="120">
      </el-table-column>

      <el-table-column prop="username" label="发布人">
        <template slot-scope="scope">
          <el-tag
            size="small"
            type="danger"
            v-for="item in scope.row.sysUserList"
            >{{ item.username }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 1" type="success"
            >正常</el-tag
          >
          <el-tag size="small" v-else-if="scope.row.status === 0" type="danger"
            >禁用</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="icon" width="260px" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="roleHandle(scope.row.id)"
            v-if="hasAuth('work:course:batch')"
            >分配批次</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="teacherHandle(scope.row.id)"
            >分配教师</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <el-button
            type="text"
            @click="editHandle(scope.row.id)"
            v-if="hasAuth('work:course:update')"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="delHandle(scope.row.id)"
            >
              <el-button
                type="text"
                slot="reference"
                v-if="hasAuth('work:course:delete')"
              >
                删除</el-button
              >
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

        <el-form-item label="状态" prop="status" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio  :label="0">禁用</el-radio>
            <el-radio  :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配批次"
      :visible.sync="roleDialogFormVisible"
      width="600px"
    >
      <el-form :model="roleForm">
        <el-tree
          :data="roleTreeData"
          show-checkbox
          ref="roleTree"
          :check-strictly="checkStrictly"
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps"
          
        >
        </el-tree>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleHandle('roleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 分配教师对话框 -->
    <el-dialog
      title="分配教师"
      :visible.sync="teacherDialogFormVisible"
      width="600px"
    >
      <el-form :model="teacherForm">
        <el-tree
          :data="teacherTreeData"
          :show-checkbox="showCheckbox"
          ref="teacherTree"
          :check-strictly="checkStrictly"
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps2"
        >
        </el-tree>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="teacherDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTeacherHandle('teacherForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Course",
  data() {
    return {
      userInfo: {},
      searchForm: {},
      delBtlStatu: true,
      disabled:true,

      teacher_id: [],

      total: 0,
      size: 10,
      current: 1,

      dialogVisible: false,
      editForm: {},

      tableData: [],

      editFormRules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },

      multipleSelection: [],

      roleDialogFormVisible: false,
      defaultProps: {
        children: "children",
        label: "bname",
      },
      roleForm: {},
      roleTreeData: [],

      teacherDialogFormVisible:false,
      teacherForm:{},
      teacherTreeData:[],
      defaultProps2: {
        children: "children",
        label: 'username'
      },
      treeCheckedKeys: [],
      checkStrictly: true,
      showCheckbox:true
    };
  },
  created() {
    this.getCourseList();
    this.getUserInfo();
    

    this.$axios.get("/work/batch/list").then((res) => {
      this.roleTreeData = res.data.data.records;
    });
    
    this.$axios.get("/work/teacher/list").then((res) => {
      this.teacherTreeData = res.data.data.records
     
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
      this.getCourseList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getCourseList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this.editForm = {};
    },
    handleClose() {
      this.resetForm("editForm");
    },

    getCourseList() {
      this.$axios
        .get("/work/course/list", {
          params: {
            name: this.searchForm.name,
            current: this.current,
            size: this.size,
          },
        })
        .then((res) => {
          this.tableData = res.data.data.records;
          this.size = res.data.data.size;
          this.current = res.data.data.current;
          this.total = res.data.data.total;
        });
    },

    submitForm(formName) {
      this.editForm.userId = this.userInfo.id;
      console.log(this.userInfo.id);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/work/course/" +
                (this.editForm.id + this.editForm.userId ? "update" : "save"),
              this.editForm
            )
            .then((res) => {
              this.$message({
                showClose: true,
                message: "恭喜你，操作成功",
                type: "success",
                onClose: () => {
                  this.getCourseList();
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
    editHandle(id) {
      this.$axios.get("/work/course/info/" + id).then((res) => {
        this.editForm = res.data.data;

        this.dialogVisible = true;
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
      this.$axios.post("/work/course/delete", ids).then((res) => {
        this.$message({
          showClose: true,
          message: "恭喜你，操作成功",
          type: "success",
          onClose: () => {
            this.getCourseList();
          },
        });
      });
    },

    roleHandle(id) {
      this.roleDialogFormVisible = true;

      this.$axios.get("/work/course/info/" + id).then((res) => {
        this.roleForm = res.data.data;
       
        let roleIds = [];
        res.data.data.batches.forEach((row) => {
          roleIds.push(row.id);
          
        });

        this.$refs.roleTree.setCheckedKeys(roleIds);
       
      });
    },
    submitRoleHandle(formName) {
      var roleIds = this.$refs.roleTree.getCheckedKeys();
    
      console.log(roleIds)

      this.$axios
        .post("/work/course/batch/" + this.roleForm.id, roleIds)
        .then((res) => {
          this.$message({
            showClose: true,
            message: "恭喜你，操作成功",
            type: "success",
            onClose: () => {
              this.getCourseList();
            },
          });

          this.roleDialogFormVisible = false;
        });
    },

    teacherHandle(id) {
      this.teacherDialogFormVisible = true;

      this.$axios.get("/work/course/info/" + id).then((res) => {
        this.teacherForm = res.data.data;
        
        let teacherIds = [];
      
        res.data.data.teacherCollegeVos.forEach((row) => {
          teacherIds.push(row.userId);
          this.teacher_id=teacherIds
          console.log(teacherIds)
        });
        
      });
    },
     submitTeacherHandle(formName) {
      var teacher_id = this.teacher_id;
      
      this.$axios
        .post("/work/course/teacher/" + this.teacherForm.id, teacher_id)
        .then((res) => {
          this.$message({
            showClose: true,
            message: "恭喜你，操作成功",
            type: "success",
            onClose: () => {
              this.getCourseList();
            },
          });

          this.teacherDialogFormVisible = false;
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