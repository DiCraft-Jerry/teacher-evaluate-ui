<template>
  <div>
    <el-upload
      ref="upload"
      action="#"
      :file-list="videoFileList"
      :http-request="uploadResourceRequest"
      style="display: inline-block"
    >
      <el-button type="primary" class="ml-5"
        >上传文件 <i class="el-icon-top"></i
      ></el-button>
    </el-upload>

    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      stripe
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="quotaName" label="名称" >
      </el-table-column>

      <el-table-column prop="quotaRight" label="权重"> </el-table-column>

      <el-table-column prop="createdTime" label="创建时间"> </el-table-column>
      <el-table-column prop="updatedTime" label="更新时间"> </el-table-column>

      <el-table-column prop="icon" label="操作">
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
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>

        </template>
      </el-table-column>
    </el-table>

    <!--新增对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="100px"
        class="demo-editForm"
      >
        <el-form-item label="上级指标" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="请选择上级指标">
            <template v-for="item in tableData">
              <el-option :label="item.quotaName" :value="item.id"></el-option>

              <template v-for="child in item.children">
                <el-option :label="child.quotaName" :value="child.id">
                  <span>{{ "- " + child.quotaName }}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="指标权重" prop="quotaRight" label-width="100px">
					<el-input v-model="editForm.quotaRight" autocomplete="off"></el-input>
				</el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Quota",
  data() {
    return {
      dialogVisible: false,
      editForm: {},
      editFormRules: {
        parentId: [{ required: true, message: "请选择上级指标", trigger: "blur" }],
        quotaName: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      tableData: [],
      videoFileList: [],
    };
  },
  created() {
    this.getQuota();
  },
  methods: {
    getQuota() {
      this.$axios.get("/sys/quota/list").then((res) => {
        this.tableData = res.data.data;
      });
    },

    /**
     * 自定义上传
     * @param elementUI自动传的参数，这个参数就是文件对象
     * */
    uploadResourceRequest(param) {
      param.status = "uploading"; //文件上传状态
      param.percentage = 0; //文件上传进度，这里设为0
      param.name = param.file.name; //文件名
      this.videoFileList.push(param); //添加到选择文件列表
      let fd = new FormData();
      // fd.append('size', param.file.size)
      fd.append("file", param.file);
      this.$axios
        .post("/sys/quota/upload", fd, {
          onUploadProgress: function (progressEvent) {
            // 处理上传进度事件
            let percent = (
              (progressEvent.loaded / progressEvent.total) *
              100
            ).toFixed(0); //计算出上传的进度，去整数位
            param.percentage = percent; //动态设置param的percentage
            // console.info(percent)
          },
        })
        .then((response) => {
          //请求成功
          // console.log(response.data);
          // param.status = 'success';  //上传成功后将status属性改成success
          this.$message.success("上传成功");
          this.getQuota();
        })
        .catch(function (error) {
          // 请求失败处理
          console.log(error);
          param.status = "failed";
          param.message = "上传失败";
        });
    },

    submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/sys/quota/update' , this.editForm)
							.then(res => {

								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose:() => {
										this.getQuota()
									}
								});

								this.dialogVisible = false
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			editHandle(id) {
				this.$axios.get('/sys/quota/info/' + id).then(res => {
					this.editForm = res.data.data
					this.dialogVisible = true
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.dialogVisible = false
				this.editForm = {}
			},
			handleClose() {
				this.resetForm('editForm')
			},
			delHandle(id) {
				this.$axios.post("/sys/quota/delete/" + id).then(res => {
					this.$message({
						showClose: true,
						message: '恭喜你，操作成功',
						type: 'success',
						onClose:() => {
							this.getQuota()
						}
					});

				})
			}
  },
};
</script>

<style scoped>
</style>