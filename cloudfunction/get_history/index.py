# -*- coding: utf8 -*-

import pymysql
import json

connection = pymysql.connect(host="mysql-host",
                             user="root",
                             password="mysql-password",
                             port=int(62580),
                             db="iceshi",
                             charset='utf8',
                             cursorclass=pymysql.cursors.DictCursor,
                             autocommit=1)


def getHistoryList(connection, wechat):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        search_stmt = (
            "SELECT * FROM `result` LEFT JOIN test on test.tid=result.test "
            "WHERE user=(SELECT uid FROM user WHERE wechat=%s) ORDER BY -rid"
        )
        data = (wechat)
        cursor.execute(search_stmt, data)
        cursor.close()
        return [{"tid": eve_history["tid"], "rid": eve_history["rid"], "title": eve_history["name"],
                 "desc": eve_history["description"] if len(eve_history["description"]) > 10 else eve_history[
                                                                                                     "description"][
                                                                                                 0:10] + "..."} for
                eve_history in cursor.fetchall()]

    except Exception as e:
        print("getHistoryList", e)
        return []


def main_handler(event, context):
    print(event)
    body = json.loads(event['body'])
    wechat = body['wechat']
    return {
        "result": getHistoryList(connection, wechat)
    }
