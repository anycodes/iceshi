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


def getQuestionList(connection, test):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        search_stmt = (
            "SELECT * FROM question LEFT JOIN selection on question.qid=selection.question WHERE test=%s"
        )
        data = (test)
        cursor.execute(search_stmt, data)
        cursor.close()
        question_dict = {}
        question = []
        for eve_question in cursor.fetchall():
            print(eve_question)
            if eve_question['qid'] not in question_dict:
                question_dict[eve_question['qid']] = {
                    "qid": eve_question['qid'],
                    "question": eve_question['content'],
                    "selection": []
                }
            question_dict[eve_question['qid']]["selection"].append(
                {
                    "score": eve_question["score"],
                    "value": eve_question["selection.content"],
                    "checked": True if len(question_dict[eve_question['qid']]["selection"]) == 0 else False
                })
        index_data = 0
        for eve_key, eve_value in question_dict.items():
            eve_value['index'] = index_data
            question.append(eve_value)
            index_data = index_data + 1

        return question

    except Exception as e:
        print("getQuestionList", e)
        return []


def addNumber(connection, test):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        search_stmt = (
            "UPDATE `test` SET times=times+1 WHERE tid=%s"
        )
        data = (test)
        cursor.execute(search_stmt, data)
        cursor.close()
        return True
    except Exception as e:
        print("addNumber", e)
        return False

def main_handler(event, context):
    print(event)

    body = json.loads(event['body'])
    test = body['test']
    addNumber(connection, test)
    return {
        "result": getQuestionList(connection, test)
    }
