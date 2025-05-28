#include <iostream>
#include "httplib/httplib.h"
#include "cJSON/cJSON.h"

float random_float(float min, float max) {
	return min + static_cast<float>(rand()) / (static_cast<float>(RAND_MAX/(max-min)));
}

void handle_wheel_rpm(const httplib::Request&, httplib::Response& res) {
	cJSON *json = cJSON_CreateObject();
	cJSON_AddNumberToObject(json, "front_left", random_float(120.0, 150.0));
	cJSON_AddNumberToObject(json, "front_right", random_float(120.0, 150.0));
	cJSON_AddNumberToObject(json, "rear_left", random_float(120.0, 150.0));
	cJSON_AddNumberToObject(json, "rear_right", random_float(120.0, 150.0));
	res.set_content(cJSON_Print(json), "application/json");
	cJSON_Delete(json);
	res.set_header("Access-Control-Allow-Origin", "*");
}

void handle_battery_stats(const httplib::Request&, httplib::Response& res) {
	cJSON *json = cJSON_CreateObject();
	cJSON_AddNumberToObject(json, "voltage", random_float(48.0, 52.4));
	cJSON_AddNumberToObject(json, "current", random_float(8.0, 12.5));
	cJSON_AddNumberToObject(json, "power", random_float(400.0, 600.0));
	cJSON_AddNumberToObject(json, "capacity", 95.3);
	res.set_content(cJSON_Print(json), "application/json");
	cJSON_Delete(json);
	res.set_header("Access-Control-Allow-Origin", "*");
}

void handle_imu_data(const httplib::Request&, httplib::Response& res) {
	cJSON *json = cJSON_CreateObject();
	cJSON_AddNumberToObject(json, "heading", random_float(0.0, 360.0));
	cJSON *mag = cJSON_CreateObject();
	cJSON_AddNumberToObject(mag, "x", random_float(-1.0, 1.0));
	cJSON_AddNumberToObject(mag, "y", random_float(-1.0, 1.0));
	cJSON_AddNumberToObject(mag, "z", random_float(-1.0, 1.0));
	cJSON_AddItemToObject(json, "magnetometer", mag);

	cJSON *gyro = cJSON_CreateObject();
	cJSON_AddNumberToObject(gyro, "x", random_float(-0.5, 0.5));
	cJSON_AddNumberToObject(gyro, "y", random_float(-0.5, 0.5));
	cJSON_AddNumberToObject(gyro, "z", random_float(-0.5, 0.5));
	cJSON_AddItemToObject(json, "gyroscope", gyro);

	cJSON *accel = cJSON_CreateObject();
	cJSON_AddNumberToObject(accel, "x", random_float(-1.0, 1.0));
	cJSON_AddNumberToObject(accel, "y", random_float(-1.0, 1.0));
	cJSON_AddNumberToObject(accel, "z", random_float(-1.0, 1.0));
	cJSON_AddItemToObject(json, "accelerometer", accel);

	res.set_content(cJSON_Print(json), "application/json");
	cJSON_Delete(json);
	res.set_header("Access-Control-Allow-Origin", "*");
}

void handle_calibration(const httplib::Request&, httplib::Response& res) {
	// 模拟校准过程
	static int calib_count = 0;
	res.set_content("校准进度: " + std::to_string(++calib_count*25) + "%", "text/plain");
	res.set_header("Access-Control-Allow-Origin", "*");
}

void handle_joystick(const httplib::Request& req, httplib::Response& res) {
	cJSON *json = cJSON_Parse(req.body.c_str());
	if (!json || !cJSON_HasObjectItem(json, "x") || !cJSON_HasObjectItem(json, "y")) {
		res.status = 400;
		return;
	}
	float x = cJSON_GetObjectItem(json, "x")->valuedouble;
	float y = cJSON_GetObjectItem(json, "y")->valuedouble;
	cJSON_Delete(json);

	// 控制逻辑（需根据实际硬件接口实现）
	std::cout << "\033[36m控制指令：X=" << x << " Y=" << y << "\033[0m\n";

	res.set_header("Access-Control-Allow-Origin", "*");
	res.set_content("OK", "text/plain");
}

int main() {
	httplib::Server svr;

	// 霓虹风格启动日志
	std::cout << "\033[35m[SYSTEM] 伺服系统初始化...\033[0m\n";
	std::cout << "\033[36m[NETWORK] 监听端口: 8080\033[0m\n";

	/*
	   svr.Get("/wheels", handle_wheel_rpm);
	   svr.Get("/battery", handle_battery_stats);
	   svr.Get("/imu", handle_imu_data);
	   svr.Post("/calibrate/heading", [](const httplib::Request&, httplib::Response& res) {
	   res.set_header("Access-Control-Allow-Origin", "*");
	   res.set_content("航向校准中...", "text/plain");
	   });
	   svr.Post("/calibrate/imu", [](const httplib::Request&, httplib::Response& res) {
	   res.set_header("Access-Control-Allow-Origin", "*");
	   res.set_content("IMU校准序列启动", "text/plain");
	   });

	   svr.Post("/joystick", handle_joystick);
	   */

	svr.Post("/api/v1/lte", [](const httplib::Request& req, httplib::Response& res) {
			std::cout << req.body << std::endl;
			});

	svr.Get("/api/v1/wifi", [](const httplib::Request& req, httplib::Response& res) {
			std::cout << req.body << std::endl;
			});

	svr.Get("/api/v1/factory", [](const httplib::Request& req, httplib::Response& res) {
			std::cout << req.body << std::endl;
			});

	svr.Get("/api/v1/driver", [](const httplib::Request& req, httplib::Response& res) {
			std::cout << req.body << std::endl;
			});

	svr.Get("/api/v1/pdp", [](const httplib::Request& req, httplib::Response& res) {
			std::cout << req.body << std::endl;
			});

	svr.Post("/api/v1/wifi", [](const httplib::Request& req, httplib::Response& res) {
			std::cout << req.body << std::endl;
			});
	svr.Post("/api/v1/factory", [](const httplib::Request& req, httplib::Response& res) {
			std::cout << req.body << std::endl;
			});
	svr.Post("/api/v1/driver", [](const httplib::Request& req, httplib::Response& res) {
			std::cout << req.body << std::endl;
			});
	svr.Post("/api/v1/pdp", [](const httplib::Request& req, httplib::Response& res) {
			std::cout << req.body << std::endl;
			});



	svr.set_base_dir("../public2");

	// 添加心跳指示灯
	svr.Get("/status", [](const httplib::Request&, httplib::Response& res) {
			res.set_content("\x1b[35mONLINE\x1b[0m", "text/plain");
			});

	svr.listen("0.0.0.0", 8080);
	return 0;
}
