<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-select
          v-model="batchForm.id"
          clearable
          placeholder="请选择学期"
          @change="getInfomation"
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

      <el-table-column prop="name" label="学院名称">
        <template slot-scope="scope">
          <el-tag
            size="small"
            type="warning"
            v-for="item in scope.row.collegeInfos"
            >{{ item.name }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="clName" label="班级名称">
        <template slot-scope="scope">
          <el-tag size="small" v-for="classinfo in scope.row.classInfos">{{
            classinfo.name
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="tName" label="教师名称">
        <template slot-scope="scope">
          <el-tag size="small" type="success" v-for="user in scope.row.users">{{
            user.username
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="caName" label="课程名称">
        <template slot-scope="scope">
          <el-tag
            size="small"
            type="danger"
            v-for="course in scope.row.courseInfos"
            >{{ course.name }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="icon" width="260px" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="evaluationHandle(scope.row.id)"
            v-if="hasAuth('reseach:infomation:evaluation')"
            >评教</el-button
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

    <!-- 开始评教 -->
    <el-dialog
      title="教研室主任评教"
      :visible.sync="permDialogVisible"
      width="600px"
    >
      <el-container>
        <el-main>
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple">
                <div v-for="(test, index) in tests" :key="index">
                  <p>{{ index + 1 }}:{{ test.quotaName }}</p>
                  <el-radio-group
                    v-model="radiaArray[test.quotaId]"
                    @change="getRadioVal(test.quotaId, test.radiaArray)"
                  >
                    <el-radio
                      v-for="(quotaOptions, k) in test.res"
                      :label="quotaOptions.id"
                      :key="k"
                    >
                      <span v-if="k == 0">A</span>
                      <span v-else-if="k == 1">B</span>
                      <span v-else-if="k == 2">C</span>
                      <span v-else-if="k == 3">D</span>
                      {{ quotaOptions.optionsName }}
                      <span hidden
                        >{{ quotaOptions.quotaRight }}:{{
                          quotaOptions.score
                        }}</span
                      >
                    </el-radio>
                  </el-radio-group>
                </div>
                <br />
                <el-button @click="permDialogVisible = false">取 消</el-button>
                <el-button @click="submitPermFormHandle" type="primary"
                  >提交</el-button
                >
              </div>
              <br />
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Infomation",
  data() {
    return {
      userInfoId: [],
      userInfo: [],
      batchForm: {},
      options: [],
      total: 0,
      size: 10,
      current: 1,

      tableData: [],

      multipleSelection: [],
      permDialogVisible: false,

      tests: [],
      radiaArray: [],
      shoarr: [],
      teachId: "",
    };
  },
  created() {
    this.getUserInfo();

    this.$axios.get("/reseach/infomation/batch").then((res) => {
      this.options = res.data.data.records;
    });
  },

  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then((res) => {
        this.userInfo = res.data.data;
        this.userInfoId = this.userInfo.id;
      });
    },

    getInfomation() {
      this.$axios
        .get("/reseach/infomation/list", {
          params: {
            batchId: this.batchForm.id,
            userId: this.userInfoId,
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
      this.getInfomation();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getInfomation();
    },

    evaluationHandle(id) {
      this.permDialogVisible = true;
      this.teachId = id;
      this.$axios
        .get("/reseach/infomation/info/" + id + "/" + this.userInfoId)
        .then((res) => {
          var data = res.data.data;

          let len = data.length;
          if (len == 0) {
            alert("你已经评教过了");

            this.permDialogVisible = false;
          }
          var permTreeData = res.data.data;

          console.log("分组前", permTreeData);
          permTreeData = mapLoction(permTreeData, "quotaName", "quotaId");
          console.log("分组后", permTreeData);

          function mapLoction(permTreeData, name, id) {
            var newArr = [];
            permTreeData.forEach(function (oldData, i) {
              var index = -1;
              var alreadyExists = newArr.some(function (newData, j) {
                if (
                  oldData[name] === newData[name] &&
                  oldData[id] === newData[id]
                ) {
                  index = j;
                  return true;
                }
              });
              if (!alreadyExists) {
                newArr.push({
                  [id]: oldData[id],
                  [name]: oldData[name],
                  res: [oldData],
                });
              } else {
                newArr[index].res.push(oldData);
              }
            });

            return newArr;
          }

          this.tests = permTreeData;
        });
    },

    getRadioVal(index, strnum) {
      let data = { name: 0, val: 0 };
      data.name = index;

      data.val = parseInt(strnum);

      this.shoarr.push(data); //将我选中的哪一题，哪个选项存到准备好的数组sharr

      let myarr = this.shoarr;
      for (var i = 0; i < myarr.length; i++) {
        for (var j = i + 1; j < myarr.length; j++) {
          if ((myarr[i].name = myarr[j].name)) {
            myarr.splice(i, 1);
            j--;
          }
        }
      } //数组去重，以最后一个选中为准
      this.shoarr = myarr;
    },

    submitPermFormHandle() {
      let test = this.radiaArray.filter((v) => {
        return (
          Object.values(v).filter((i) => {
            return i != null;
          }).length === Object.values(v).length
        );
      });
      console.log(test);
      this.$axios
        .post(
          "/reseach/infomation/options/" + this.userInfoId + "/" + this.teachId,
          test
        )
        .then((res) => {
          this.$message({
            showClose: true,
            message: "恭喜你，操作成功",
            type: "success",
            onClose: () => {
              this.getInfomation();
            },
          });
          this.permDialogVisible = false;
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

.el-radio {
  display: block;
  line-height: 23px;
  white-space: normal;
  margin-right: 0;
}

/* 题目*/
.tihao {
  display: flex;
  justify-content: space-around;
}
.ti {
  display: inline-block;
  width: 25px;
  height: 25px;
  line-height: 27px;
  border: 1px solid #bbb;
  color: #bbb;
  border-radius: 50%;
  text-align: center;
}
.active {
  background-color: blue;
  color: white;
}
</style>