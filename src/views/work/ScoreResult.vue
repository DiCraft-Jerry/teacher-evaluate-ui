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

    </el-form>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      stripe

    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column prop="id" label="编号"> </el-table-column>

      <el-table-column prop="batchName" label="学期名称">
        
      </el-table-column>
      
      <el-table-column prop="teacherName" label="教师名称">
        
      </el-table-column>
      <el-table-column prop="collegeName" label="学院名称">
      </el-table-column>

      <el-table-column prop="className" label="班级名称">
    
      </el-table-column>

      <el-table-column prop="courseName" label="课程名称">
      </el-table-column>

       <el-table-column prop="score" label="总分">
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
    this.getRecord();
    this.$axios.get("/work/batch/list").then((res) => {
      this.options = res.data.data.records;
    });
   
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then((res) => {
        this.userInfo = res.data.data;
      });
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
      this.$axios
        .get("/work/scoreResult/list", {
          params: {
            batchId:this.batchForm.id,
            current: this.current,
            size: this.size,
          },
        })
        .then((res) => {
          this.tableData = res.data.data;
          this.size = res.data.data.size;
          this.current = res.data.data.current;
          this.total = res.data.data.total;

          console.log(this.tableData)
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