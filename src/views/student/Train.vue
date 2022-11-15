<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-select
          v-model="batchForm.id"
          clearable
          placeholder="请选择学期"
          @change="getTrainList"
        >
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column prop="id" label="编号"> </el-table-column>

      <el-table-column prop="name" label="课程名称" width="120">
        <template slot-scope="scope">
          <el-tag
            size="small"
            type="success"
            v-for="course in scope.row.courseInfos"
            >{{ course.name }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="username" label="授课教师">
        <template slot-scope="scope">
          <el-tag size="small" type="warning" v-for="item in scope.row.users">{{
            item.username
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="className" label="班级名称">
        <template slot-scope="scope">
          <el-tag
            size="small"
            type="warning"
            v-for="classes in scope.row.classInfos"
            >{{ classes.name }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="collegeName" label="开课学院">
        <template slot-scope="scope">
          <el-tag
            size="small"
            type="warning"
            v-for="item in scope.row.collegeInfos"
            >{{ item.name }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="icon" width="260px" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="roleHandle(scope.row.id)"
            v-if="hasAuth('student:train:course')"
            >选课</el-button
          >
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
  </div>
</template>

<script>
export default {
  name: "Course",
  data() {
    return {
      userInfo: {},
      batchForm: {},
      total: 0,
      size: 10,
      current: 1,
      options: [],

      tableData: [],

      multipleSelection: [],
    };
  },
  created() {
    this.getUserInfo();
    this.$axios.get("/student/train/batch").then((res) => {
      this.options = res.data.data.records;

      console.log(this.options);
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
      this.getTrainList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getTrainList();
    },

    getTrainList() {
      this.$axios
        .get("/student/train/list", {
          params: {
            batchId: this.batchForm.id,
            current: this.current,
            size: this.size,
          },
        })
        .then((res) => {
          this.tableData = res.data.data.records;
          this.size = res.data.data.size;
          this.current = res.data.data.current;
          this.total = res.data.data.total;

          console.log(this.tableData);
        });
    },

    roleHandle(teachId) {
      var batchId = this.batchForm.id;
      var userId = this.userInfo.id;
      console.log(teachId);
      this.$axios
        .post("/student/train/course/" + teachId + "/" + userId + "/" + batchId)
        .then((res) => {
          this.$message({
            showClose: true,
            message: "恭喜你，操作成功",
            type: "success",
            onClose: () => {
              this.getTrainList();
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