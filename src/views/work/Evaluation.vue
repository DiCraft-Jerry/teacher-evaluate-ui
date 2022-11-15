<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button
          type="primary"
          @click="dialogVisible = true"
          v-if="hasAuth('work:evaluation:save')"
          >新增</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button
            type="danger"
            slot="reference"
            :disabled="delBtlStatu"
            v-if="hasAuth('work:evaluation:delete')"
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

      <el-table-column prop="name" label="评教人群名称"> </el-table-column>

      <el-table-column prop="startTime" label="开始时间"> </el-table-column>

      <el-table-column prop="endTime" label="结束时间"> </el-table-column>

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 1" type="success"
            >已开启评教</el-tag
          >
          <el-tag size="small" v-else-if="scope.row.status === 0" type="danger"
            >未开启评教</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="icon" width="260px" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="permHandle(scope.row.id)"
            >分配权限</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <el-button
            type="text"
            @click="startHandle(scope.row.id, scope.row.status)"
            >开启评教</el-button
          >

          <el-button type="text" @click="endHandle(scope.row.id, scope.row.status)"
            >结束评教</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="delHandle(scope.row.id)"
            >
              <el-button type="text" slot="reference">删除</el-button>
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
        <el-form-item label="评教人群" prop="roleId" label-width="100px">
          <el-select
            v-model="editForm.roleId"
            clearable
            placeholder="请选择评教人群"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime" label-width="100px">
          <div class="block">
            <el-date-picker
              v-model="editForm.startTime"
              type="datetime"
              placeholder="选择日期时间"
              autocomplete="off"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime" label-width="100px">
          <div class="block">
            <el-date-picker
              v-model="editForm.endTime"
              type="datetime"
              placeholder="选择日期时间"
              autocomplete="off"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 分配问卷 -->
    <el-dialog title="分配问卷" :visible.sync="permDialogVisible" width="600px">
      <el-form :model="permForm">
        <el-tree
          :data="permTreeData"
          show-checkbox
          ref="permTree"
          :default-expand-all="true"
          node-key="id"
          :check-strictly="false"
          :props="defaultProps"
        >
        </el-tree>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="permDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermFormHandle('permForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Evaluation",
  data() {
    return {
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },

      delBtlStatu: true,
      options: [],
      total: 0,
      size: 10,
      current: 1,

      dialogVisible: false,
      editForm: {},

      tableData: [],
      multipleSelection: [],
      postForm: {},
      permDialogVisible: false,
      permForm: {},
      defaultProps: {
        children: "children",
        label: "quotaName",
      },
      permTreeData: [],
      status: "",
    };
  },
  created() {
    this.getEvaluation();

    this.$axios.get("/work/evaluation/role").then((res) => {
      this.options = res.data.data.records;
    });

    this.$axios.get("/sys/quota/list").then((res) => {
      this.permTreeData = res.data.data;
    });
  },
  methods: {
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
      this.getEvaluation();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getEvaluation();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this.editForm = {};
    },
    handleClose() {
      this.resetForm("editForm");
    },

    getEvaluation() {
      this.$axios
        .get("/work/evaluation/list", {
          params: {
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/work/evaluation/save", this.editForm)
            .then((res) => {
              this.$message({
                showClose: true,
                message: "恭喜你，操作成功",
                type: "success",
                onClose: () => {
                  this.getEvaluation();
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

    startHandle(id, status) {
      this.$axios
        .post("/work/evaluation/update/" + id + "/" + status)
        .then((res) => {
          var data = res.data.data;

          let len = data.length;
          console.log(len)

          if (len == 0) {
            this.$message({
              showClose: true,
              message: "请勿重复开启评教",
              type: "error",
              onClose: () => {
                this.getEvaluation();
              },
            });
          } else {
            
            this.$message({
              showClose: true,
              message: "恭喜你,成功开启评教",
              type: "success",
              onClose: () => {
                this.getEvaluation();
              },
            });
          }
        });
    },

    endHandle(id, status) {
      console.log(id);
      console.log(status);
      this.$axios
        .post("/work/evaluation/end/" + id + "/" + status)
        .then((res) => {
          var data = res.data.data;

          let len = data.length;
          console.log(len)

          if (len == 0) {
            this.$message({
              showClose: true,
              message: "请勿重复结束评教",
              type: "error",
              onClose: () => {
                this.getEvaluation();
              },
            });
          } else {
            this.$message({
              showClose: true,
              message: "恭喜你,成功关闭评教",
              type: "success",
              onClose: () => {
                this.getEvaluation();
              },
            });
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

      console.log(ids);

      this.$axios.post("/work/evaluation/delete", ids).then((res) => {
        this.$message({
          showClose: true,
          message: "恭喜你，操作成功",
          type: "success",
          onClose: () => {
            this.getEvaluation();
          },
        });
      });
    },

    permHandle(id) {
      this.permDialogVisible = true;

      this.$axios.get("/work/evaluation/info/" + id).then((res) => {
        this.$refs.permTree.setCheckedKeys(res.data.data.quotaIds);
        this.permForm = res.data.data;
      });
    },

    submitPermFormHandle(formName) {
      var quotaIds = this.$refs.permTree.getCheckedKeys();

      console.log(quotaIds + "---------------------------------");

      this.$axios
        .post("/work/evaluation/perm/" + this.permForm.roleId, quotaIds)
        .then((res) => {
          this.$message({
            showClose: true,
            message: "恭喜你，操作成功",
            type: "success",
            onClose: () => {
              this.getEvaluation();
            },
          });
          this.permDialogVisible = false;
          this.resetForm(formName);
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