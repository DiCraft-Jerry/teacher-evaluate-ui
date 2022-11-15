<template>
  <div>
    <el-form :inline="true" >
      <el-form-item>
        <el-select v-model="batchForm.id" clearable placeholder="请选择学期" @change="getRecord">
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
          <el-select v-model="batchForm.roleId" clearable placeholder="请选择评教人群" @change="getRecord">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
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

      <el-table-column prop="batchName" label="学期名称">
        
      </el-table-column>
      
      <el-table-column prop="userName" label="学生名称">
        
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称">
    
      </el-table-column>

      <el-table-column prop="courseName" label="课程名称">
      </el-table-column>

       <el-table-column prop="score" label="课程名称">
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

    
  </div>
</template>

<script>
export default {
  name: "Record",
  data() {
    return {
      userInfo: {},
      batchForm: {},

      total: 0,
      size: 10,
      current: 1,

      tableData: [],

      multipleSelection: [],
    
      options: [],
      roles: [],

    };
  },
  created() {
    this.$axios.get("/work/batch/list").then((res) => {
      this.options = res.data.data.records;
    });

    this.$axios.get("/work/evaluation/role").then((res) => {
      this.roles = res.data.data.records;
    });

   
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then((res) => {
        this.userInfo = res.data.data;
      });
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
      this.getRecord();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getRecord();
    },


    getRecord() {
        console.log(this.batchForm.id)
        console.log(this.batchForm.roleId)
      this.$axios
        .get("/work/record/list", {
          params: {
            batchId:this.batchForm.id,
            roleId:this.batchForm.roleId,
            current: this.current,
            size: this.size,
          },
        })
        .then((res) => {
          this.tableData = res.data.data;
          this.size = res.data.data.size;
          this.current = res.data.data.current;
          this.total = res.data.data.total;
        });
      
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/work/teach/save", this.editForm).then((res) => {
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
  },
};
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>