#!/usr/bin/env bash

function usage()
{
    printf "\nGather the translation requests\n"
    printf "===============================\n\n"
    printf "./collect_translation_requests.sh <options>"
    printf "\n\n"
    printf "Options\n"
    printf "======\n\n"
    printf "\t-h --help\n"
    printf "\t--base_branch | -base=<branch to compare the changes with [default branch is development]>\n"
    printf "\t--branches | -b=<comma separated list of branches with translation requests>\n"
    printf "\t--output | -o=<absolute path to save the output file> default value is <script directory>/output.json"
    printf "\n"
}

BASE_BRANCH="development"
BRANCHES=()
FILE_DIRECTORY="src/assets/i18n"
TRANSLATION_REQUEST_FILE="en-US.json"
SCRIPT_DIRECTORY=`dirname $0`

BASE_JSON="base.json"
CHANGED_JSON="change.json"
DIFFERENCE_JSON="diff.json"
OUTPUT_PATH="${SCRIPT_DIRECTORY}/output.json"

while [[ "$1" != "" ]]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk -F= '{print $2}'`
    case ${PARAM} in
        -h | --help)
            usage
            exit
            ;;
        --base_branch | -base)
            BASE_BRANCH=${VALUE}
            ;;
        --branches | -b)
			OIFS=$IFS
			IFS=","
            BRANCHES=(${VALUE})
            IFS=$OIFS
            ;;
        --output | -o)
            OUTPUT_PATH=${VALUE}
            ;;
        *)
            echo "ERROR: unknown parameter \"${PARAM}\""
            usage
            exit 1
            ;;
    esac
    shift
done

#create the output file first
mkdir -p `dirname "${OUTPUT_PATH}"` && touch ${OUTPUT_PATH};
#printf "{}" > ${OUTPUT_PATH}

for ((i=0; i<${#BRANCHES[@]}; ++i)); do
	git show "${BASE_BRANCH}:${FILE_DIRECTORY}/${TRANSLATION_REQUEST_FILE}" > "${SCRIPT_DIRECTORY}/${BASE_JSON}"
	git show "${BRANCHES[$i]}:${FILE_DIRECTORY}/${TRANSLATION_REQUEST_FILE}" > "${SCRIPT_DIRECTORY}/${CHANGED_JSON}"
	node "${SCRIPT_DIRECTORY}/main.js" --base "${SCRIPT_DIRECTORY}/${BASE_JSON}" --source "${SCRIPT_DIRECTORY}/${CHANGED_JSON}" --command diff > "${SCRIPT_DIRECTORY}/${DIFFERENCE_JSON}"
	node "${SCRIPT_DIRECTORY}/main.js" --base "${OUTPUT_PATH}" --source "${SCRIPT_DIRECTORY}/${DIFFERENCE_JSON}" --command merge > ${OUTPUT_PATH}
done
